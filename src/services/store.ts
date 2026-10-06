import {
  Project,
  LocationMilestone,
  GalleryItem,
  Testimonial,
  Lead,
  SiteVisitRequest,
  WebsiteContent,
  ContactSettings,
  SEOSettings,
  AdminUser,
  PromotionalPopupSettings,
  ChannelPartnerContent,
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_LOCATIONS,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_LEADS,
  INITIAL_SITE_VISITS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_CONTACT_SETTINGS,
  INITIAL_SEO_SETTINGS,
  INITIAL_ADMIN_USERS,
  INITIAL_POPUP_SETTINGS,
  INITIAL_CHANNEL_PARTNER_CONTENT,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROJECTS: 'velora_projects',
  LOCATIONS: 'velora_locations',
  GALLERY: 'velora_gallery',
  TESTIMONIALS: 'velora_testimonials',
  LEADS: 'velora_leads',
  SITE_VISITS: 'velora_site_visits',
  WEBSITE_CONTENT: 'velora_website_content',
  CHANNEL_PARTNER_CONTENT: 'velora_channel_partner_content',
  CONTACT_SETTINGS: 'velora_contact_settings',
  SEO_SETTINGS: 'velora_seo_settings',
  POPUP_SETTINGS: 'velora_popup_settings',
  AUTH: 'velora_admin_auth',
  ADMIN_USERS: 'velora_admin_users',
  CURRENT_USER: 'velora_admin_current_user',
};

const memoryCache: Record<string, any> = {};
const IDB_STORE_NAME = 'app_keyval';
const IDB_DB_NAME = 'velora_persistence_db';

function openPersistenceDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IDB'));
  });
}

async function idbSave(key: string, value: any): Promise<void> {
  try {
    const db = await openPersistenceDB();
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    store.put(value, key);
  } catch (err) {
    console.warn(`IDB write for ${key}:`, err);
  }
}

async function idbLoad(key: string): Promise<any> {
  try {
    const db = await openPersistenceDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
  } catch {
    return undefined;
  }
}

// Push a key-value pair to the backend Express server
async function pushToServer(key: string, value: any): Promise<void> {
  if (typeof fetch === 'undefined') return;
  try {
    await fetch(`/api/store/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } catch (err) {
    // Non-fatal if offline
    console.debug(`[Store] Background push note for ${key}:`, err);
  }
}

// Full server sync: pull latest data from server, or if server is empty, push local data to server
async function syncWithServer(): Promise<{ synced: boolean; source: 'server' | 'local' | 'none' }> {
  if (typeof fetch === 'undefined') return { synced: false, source: 'none' };
  try {
    const res = await fetch('/api/store');
    if (!res.ok) return { synced: false, source: 'none' };
    const json = await res.json();
    const serverData: Record<string, any> = json?.data || {};
    const serverKeys = Object.keys(serverData);

    if (serverKeys.length > 0) {
      // Server has data: update local memory cache, IndexedDB, and localStorage
      let hasUpdates = false;
      for (const [key, val] of Object.entries(serverData)) {
        if (val !== undefined && val !== null) {
          memoryCache[key] = val;
          idbSave(key, val);
          try {
            localStorage.setItem(key, JSON.stringify(val));
          } catch {}
          hasUpdates = true;
        }
      }
      if (hasUpdates) {
        window.dispatchEvent(new Event('velora_store_updated'));
      }
      return { synced: true, source: 'server' };
    } else {
      // Server is empty: push local snapshot to server so all other browsers can see it
      const snapshot: Record<string, any> = {};
      for (const key of Object.values(STORAGE_KEYS)) {
        const localVal = memoryCache[key] ?? loadFromStorage(key, null);
        if (localVal !== null && localVal !== undefined) {
          snapshot[key] = localVal;
        }
      }
      if (Object.keys(snapshot).length > 0) {
        await fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(snapshot),
        });
        return { synced: true, source: 'local' };
      }
    }
  } catch (err) {
    console.debug('[Store] Server sync note:', err);
  }
  return { synced: false, source: 'none' };
}

// Background hydration: Load persistent data from IndexedDB on startup, then sync with server
if (typeof indexedDB !== 'undefined') {
  openPersistenceDB()
    .then(async () => {
      let hasUpdates = false;
      for (const key of Object.values(STORAGE_KEYS)) {
        const storedVal = await idbLoad(key);
        if (storedVal !== undefined && storedVal !== null) {
          memoryCache[key] = storedVal;
          hasUpdates = true;
        }
      }
      if (hasUpdates) {
        window.dispatchEvent(new Event('velora_store_updated'));
      }
      // After local DB hydration, sync with backend server
      syncWithServer().catch(() => {});
    })
    .catch(() => {
      syncWithServer().catch(() => {});
    });
} else if (typeof window !== 'undefined') {
  syncWithServer().catch(() => {});
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key];
  }
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      memoryCache[key] = defaultValue;
      return defaultValue;
    }
    const parsed = JSON.parse(saved);
    memoryCache[key] = parsed;
    return parsed;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    memoryCache[key] = defaultValue;
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  // 1. Immediately update memory cache
  memoryCache[key] = value;

  // 2. Persist to IndexedDB (virtually unlimited quota for large photos/base64)
  idbSave(key, value);

  // 3. Try to save to localStorage as well
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err: any) {
    console.warn(`Storage quota note for ${key}:`, err?.message || err);
    try {
      localStorage.removeItem('velora_temp');
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // IndexedDB has already persisted the data securely
    }
  }

  // 4. Send to backend Express server so all browsers receive it
  pushToServer(key, value).catch(() => {});

  // 5. Trigger window event so all subscribed components update reactively
  window.dispatchEvent(new Event('velora_store_updated'));
}

export const StoreService = {
  // Cloud / Server Sync
  syncWithServer: (): Promise<{ synced: boolean; source: 'server' | 'local' | 'none' }> => {
    return syncWithServer();
  },
  pushAllToCloud: async (): Promise<boolean> => {
    const snapshot: Record<string, any> = {};
    for (const key of Object.values(STORAGE_KEYS)) {
      const localVal = memoryCache[key] ?? loadFromStorage(key, null);
      if (localVal !== null && localVal !== undefined) {
        snapshot[key] = localVal;
      }
    }
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  // Projects
  getProjects: (): Project[] => {
    return loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },
  getProjectBySlug: (slug: string): Project | undefined => {
    const list = StoreService.getProjects();
    return list.find((p) => p.slug === slug || p.id === slug);
  },
  saveProject: (project: Project): void => {
    const current = [...StoreService.getProjects()];
    const idx = current.findIndex(
      (p) => p.id === project.id || (p.slug && p.slug === project.slug)
    );
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...project };
    } else {
      current.push(project);
    }
    saveToStorage(STORAGE_KEYS.PROJECTS, current);
  },
  deleteProject: (id: string): void => {
    const filtered = StoreService.getProjects().filter((p) => p.id !== id && p.slug !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
  },

  // Locations
  getLocations: (): LocationMilestone[] => {
    return loadFromStorage<LocationMilestone[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  },
  saveLocations: (locations: LocationMilestone[]): void => {
    saveToStorage(STORAGE_KEYS.LOCATIONS, locations);
  },
  updateLocation: (loc: LocationMilestone): void => {
    const list = StoreService.getLocations();
    const idx = list.findIndex((l) => l.id === loc.id);
    if (idx >= 0) {
      list[idx] = loc;
    } else {
      list.push(loc);
    }
    saveToStorage(STORAGE_KEYS.LOCATIONS, list);
  },
  deleteLocation: (id: string): void => {
    const list = StoreService.getLocations().filter((l) => l.id !== id);
    saveToStorage(STORAGE_KEYS.LOCATIONS, list);
  },

  // Gallery
  getGallery: (): GalleryItem[] => {
    return loadFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  },
  saveGalleryItem: (item: GalleryItem): void => {
    const list = StoreService.getGallery();
    const idx = list.findIndex((g) => g.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    saveToStorage(STORAGE_KEYS.GALLERY, list);
  },
  deleteGalleryItem: (id: string): void => {
    const list = StoreService.getGallery().filter((g) => g.id !== id);
    saveToStorage(STORAGE_KEYS.GALLERY, list);
  },

  // Testimonials
  getTestimonials: (): Testimonial[] => {
    return loadFromStorage<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  },
  saveTestimonial: (test: Testimonial): void => {
    const list = StoreService.getTestimonials();
    const idx = list.findIndex((t) => t.id === test.id);
    if (idx >= 0) {
      list[idx] = test;
    } else {
      list.push(test);
    }
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, list);
  },
  deleteTestimonial: (id: string): void => {
    const list = StoreService.getTestimonials().filter((t) => t.id !== id);
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, list);
  },

  // Leads
  getLeads: (): Lead[] => {
    return loadFromStorage<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  },
  saveLead: (lead: Lead): void => {
    const list = StoreService.getLeads();
    const idx = list.findIndex((l) => l.id === lead.id);
    if (idx >= 0) {
      list[idx] = lead;
    } else {
      list.unshift(lead);
    }
    saveToStorage(STORAGE_KEYS.LEADS, list);
  },
  addLead: (leadData: Omit<Lead, 'id' | 'date' | 'time' | 'status'> & { status?: Lead['status'] }): Lead => {
    const list = StoreService.getLeads();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newLead: Lead = {
      id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: `${day} ${month} ${year}`,
      time,
      status: leadData.status || 'New',
      ...leadData,
    };
    list.unshift(newLead);
    saveToStorage(STORAGE_KEYS.LEADS, list);
    return newLead;
  },
  updateLeadStatus: (id: string, status: Lead['status'], notes?: string): void => {
    const list = StoreService.getLeads();
    const item = list.find((l) => l.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      saveToStorage(STORAGE_KEYS.LEADS, list);
    }
  },
  deleteLead: (id: string): void => {
    const list = StoreService.getLeads().filter((l) => l.id !== id);
    saveToStorage(STORAGE_KEYS.LEADS, list);
  },

  // Site Visits
  getSiteVisits: (): SiteVisitRequest[] => {
    return loadFromStorage<SiteVisitRequest[]>(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS);
  },
  saveSiteVisit: (visit: SiteVisitRequest): void => {
    const list = StoreService.getSiteVisits();
    const idx = list.findIndex((s) => s.id === visit.id);
    if (idx >= 0) {
      list[idx] = visit;
    } else {
      list.unshift(visit);
    }
    saveToStorage(STORAGE_KEYS.SITE_VISITS, list);
  },
  addSiteVisit: (data: Omit<SiteVisitRequest, 'id' | 'createdAt' | 'status'> & { status?: SiteVisitRequest['status'] }): SiteVisitRequest => {
    const list = StoreService.getSiteVisits();
    const newReq: SiteVisitRequest = {
      id: `SV-${Math.floor(200 + Math.random() * 800)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: data.status || 'Requested',
      ...data,
    };
    list.unshift(newReq);
    saveToStorage(STORAGE_KEYS.SITE_VISITS, list);
    return newReq;
  },
  updateSiteVisitStatus: (id: string, status: SiteVisitRequest['status'], notes?: string): void => {
    const list = StoreService.getSiteVisits();
    const item = list.find((s) => s.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      saveToStorage(STORAGE_KEYS.SITE_VISITS, list);
    }
  },
  deleteSiteVisit: (id: string): void => {
    const list = StoreService.getSiteVisits().filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SITE_VISITS, list);
  },

  // Website Content
  getWebsiteContent: (): WebsiteContent => {
    return loadFromStorage<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
  },
  saveWebsiteContent: (content: WebsiteContent): void => {
    saveToStorage(STORAGE_KEYS.WEBSITE_CONTENT, content);
  },

  // Channel Partner Page Content
  getChannelPartnerContent: (): ChannelPartnerContent => {
    return loadFromStorage<ChannelPartnerContent>(
      STORAGE_KEYS.CHANNEL_PARTNER_CONTENT,
      INITIAL_CHANNEL_PARTNER_CONTENT
    );
  },
  saveChannelPartnerContent: (content: ChannelPartnerContent): void => {
    saveToStorage(STORAGE_KEYS.CHANNEL_PARTNER_CONTENT, content);
  },

  // Contact Settings
  getContactSettings: (): ContactSettings => {
    return loadFromStorage<ContactSettings>(STORAGE_KEYS.CONTACT_SETTINGS, INITIAL_CONTACT_SETTINGS);
  },
  saveContactSettings: (settings: ContactSettings): void => {
    saveToStorage(STORAGE_KEYS.CONTACT_SETTINGS, settings);
  },

  // SEO Settings
  getSEOSettings: (): SEOSettings => {
    return loadFromStorage<SEOSettings>(STORAGE_KEYS.SEO_SETTINGS, INITIAL_SEO_SETTINGS);
  },
  saveSEOSettings: (seo: SEOSettings): void => {
    saveToStorage(STORAGE_KEYS.SEO_SETTINGS, seo);
  },

  // Authentication & Admin Users Management
  getAdminUsers: (): AdminUser[] => {
    return loadFromStorage<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
  },

  saveAdminUsers: (users: AdminUser[]): void => {
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, users);
  },

  saveAdminUser: (user: AdminUser): void => {
    const current = StoreService.getAdminUsers();
    const idx = current.findIndex(
      (u) => u.id === user.id || u.email.trim().toLowerCase() === user.email.trim().toLowerCase()
    );
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...user };
    } else {
      current.push(user);
    }
    StoreService.saveAdminUsers(current);

    // If currently logged in user modified their own details, update current session
    const currentUser = StoreService.getCurrentUser();
    if (currentUser && (currentUser.id === user.id || currentUser.email.toLowerCase() === user.email.toLowerCase())) {
      StoreService.setCurrentUser({ ...currentUser, ...user });
    }
  },

  deleteAdminUser: (id: string): { success: boolean; message: string } => {
    const users = StoreService.getAdminUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return { success: false, message: 'User not found.' };

    if (target.isOwner) {
      return { success: false, message: 'Cannot delete the primary owner account.' };
    }

    const remainingSuperAdmins = users.filter((u) => u.role === 'Super Admin' && u.id !== id);
    if (target.role === 'Super Admin' && remainingSuperAdmins.length === 0) {
      return { success: false, message: 'Cannot delete the only Super Admin. At least one Super Admin must exist.' };
    }

    const filtered = users.filter((u) => u.id !== id);
    StoreService.saveAdminUsers(filtered);
    return { success: true, message: `Account "${target.name}" removed.` };
  },

  getCurrentUser: (): AdminUser => {
    const saved = loadFromStorage<AdminUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) return saved;
    const users = StoreService.getAdminUsers();
    return users[0] || INITIAL_ADMIN_USERS[0];
  },

  setCurrentUser: (user: AdminUser): void => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  updateUserPassword: (
    userId: string,
    currentPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    const users = StoreService.getAdminUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'User account not found.' };

    if (user.password !== currentPass.trim()) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    user.password = newPass.trim();
    StoreService.saveAdminUsers(users);

    const currentUser = StoreService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      StoreService.setCurrentUser({ ...currentUser, password: newPass.trim() });
    }

    return { success: true, message: 'Password updated successfully!' };
  },

  isAdminAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  loginAdmin: (
    firstParam: string,
    secondParam?: string
  ): { success: boolean; message: string; user?: AdminUser } => {
    const users = StoreService.getAdminUsers();

    let email = '';
    let password = '';

    if (secondParam !== undefined) {
      email = firstParam.trim().toLowerCase();
      password = secondParam.trim();
    } else {
      // Legacy fallback: single parameter password
      password = firstParam.trim();
      const matched = users.find((u) => u.password === password && u.status === 'Active');
      if (matched) {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        StoreService.setCurrentUser(matched);
        window.dispatchEvent(new Event('velora_store_updated'));
        return { success: true, message: `Welcome back, ${matched.name}!`, user: matched };
      }
      return { success: false, message: 'Invalid password. Access restricted to authorized personnel.' };
    }

    // Email + Password authentication
    const user = users.find((u) => u.email.trim().toLowerCase() === email);
    if (!user) {
      return {
        success: false,
        message: 'No authorized administrator or employee found with this email.',
      };
    }

    if (user.status === 'Suspended') {
      return {
        success: false,
        message: 'This account is currently suspended. Please contact the Velora Super Administrator.',
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password. Only authorized employees and administrators can assess the admin panel.',
      };
    }

    // Success! Update lastLogin
    user.lastLogin = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    StoreService.saveAdminUsers(users);
    StoreService.setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    window.dispatchEvent(new Event('velora_store_updated'));

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
    };
  },

  // Promotional / Announcement Popup
  getPopupSettings: (): PromotionalPopupSettings => {
    return loadFromStorage<PromotionalPopupSettings>(
      STORAGE_KEYS.POPUP_SETTINGS,
      INITIAL_POPUP_SETTINGS
    );
  },
  savePopupSettings: (settings: PromotionalPopupSettings): void => {
    saveToStorage(STORAGE_KEYS.POPUP_SETTINGS, settings);
  },

  logoutAdmin: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new Event('velora_store_updated'));
  },

  // Reset to Factory Defaults
  resetAll: (): void => {
    localStorage.clear();
    saveToStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    saveToStorage(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    saveToStorage(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    saveToStorage(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    saveToStorage(STORAGE_KEYS.SITE_VISITS, INITIAL_SITE_VISITS);
    saveToStorage(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
    saveToStorage(STORAGE_KEYS.CONTACT_SETTINGS, INITIAL_CONTACT_SETTINGS);
    saveToStorage(STORAGE_KEYS.SEO_SETTINGS, INITIAL_SEO_SETTINGS);
    saveToStorage(STORAGE_KEYS.POPUP_SETTINGS, INITIAL_POPUP_SETTINGS);
    saveToStorage(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_ADMIN_USERS[0]);
    window.dispatchEvent(new Event('velora_store_updated'));
  },
};
