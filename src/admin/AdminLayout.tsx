import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  Users,
  Calendar,
  MessageSquareQuote,
  MapPin,
  FileText,
  Settings,
  TrendingUp,
  User,
  Shield,
  Camera,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Cloud,
  Check,
  Loader2,
  Megaphone,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { StoreService } from '../services/store';

export type AdminViewType =
  | 'dashboard'
  | 'projects'
  | 'home-photos'
  | 'popup'
  | 'gallery'
  | 'leads'
  | 'partner-leads'
  | 'site-visits'
  | 'testimonials'
  | 'locations'
  | 'content'
  | 'channel-partner-content'
  | 'settings'
  | 'seo'
  | 'users';

interface AdminLayoutProps {
  currentView: AdminViewType;
  onSelectView: (view: AdminViewType) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  onSelectView,
  onNavigateHome,
  onLogout,
  children,
}) => {
  const { leads, siteVisits, currentUser, popupSettings } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    try {
      const ok = await StoreService.pushAllToCloud();
      if (ok) {
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD';

  const navItems: { id: AdminViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'home-photos', label: 'Homepage Photos', icon: <Camera className="w-4 h-4" /> },
    {
      id: 'popup',
      label: 'Promotional Popup',
      icon: <Megaphone className="w-4 h-4" />,
      badge: popupSettings?.enabled ? 1 : undefined,
    },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    {
      id: 'leads',
      label: 'Customer Leads',
      icon: <Users className="w-4 h-4" />,
      badge: leads.filter((l) => l.source !== 'Channel Partner' && l.status === 'New').length,
    },
    {
      id: 'partner-leads',
      label: 'Partner Inquiries',
      icon: <UserCheck className="w-4 h-4" />,
      badge: leads.filter((l) => l.source === 'Channel Partner' && l.status === 'New').length,
    },
    { id: 'site-visits', label: 'Site Visits', icon: <Calendar className="w-4 h-4" />, badge: siteVisits.filter(s => s.status === 'Requested').length },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: 'locations', label: 'Locations', icon: <MapPin className="w-4 h-4" /> },
    { id: 'content', label: 'Website Content', icon: <FileText className="w-4 h-4" /> },
    { id: 'channel-partner-content', label: 'Channel Partner CMS', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'settings', label: 'Contact Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO Settings', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'users', label: 'Admin Users & Security', icon: <Shield className="w-4 h-4" /> },
  ];

  const handleNav = (view: AdminViewType) => {
    onSelectView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex text-[#26342D] font-sans antialiased">
      {/* SIDEBAR (Desktop: sticky, Mobile: slide-out overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#00291E] text-white flex flex-col justify-between border-r border-[#C9A24A]/25 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo branding */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative">
          <button
            onClick={() => handleNav('dashboard')}
            className="flex flex-col items-center focus:outline-none"
          >
            <Logo variant="light" size="sm" showTagline={true} />
          </button>

          {/* Close for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#C9A24A]/20 text-[#DDB75C] border border-[#C9A24A]/40 font-semibold shadow-sm'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#C9A24A]' : 'text-white/60'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-[#C9A24A] text-[#00291E] font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar bottom card matching layout.png */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-[#001D15] p-3.5 rounded-lg border border-[#C9A24A]/20 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24A] block">
                Build · Manage · Grow
              </span>
              <p className="text-[11px] text-white/90 font-medium mt-0.5">
                Velora Developers Admin Panel
              </p>
              <p className="text-[9px] text-white/40 mt-1">v1.0 · Powered by Velora Core</p>
            </div>
            {/* Background subtle leaf glow */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#C9A24A]/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Quick Logout button */}
          <button
            onClick={onLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-white/60 hover:text-red-300 py-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar matching layout.png */}
        <header className="sticky top-0 z-20 bg-[#F8F0D8] border-b border-[#C9A24A]/25 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-sm">
          {/* Left: Mobile hamburger & Search input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#00291E] hover:bg-black/5 rounded-md"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar matching layout.png */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#26342D]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, leads, content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FFF8E7] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-full text-xs text-[#00291E] placeholder-[#26342D]/40 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right: Public Website Link, Notifications, Profile Pill */}
          <div className="flex items-center gap-3">
            {/* Sync All Changes to Cloud Server */}
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              title="Sync all photos and data to cloud server so they are visible on all browsers and devices"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#00291E] hover:text-[#C9A24A] bg-[#FFF8E7] border border-[#C9A24A]/40 px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 text-[#C9A24A] animate-spin" />
              ) : syncSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-[#C9A24A]" />
              )}
              <span className="hidden sm:inline">
                {syncSuccess ? 'Synced to Cloud!' : isSyncing ? 'Syncing...' : 'Sync to Cloud'}
              </span>
            </button>

            {/* View Website button */}
            <button
              onClick={onNavigateHome}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#00291E] hover:text-[#C9A24A] bg-[#FFF8E7] border border-[#C9A24A]/30 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3 text-[#C9A24A]" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#00291E] hover:bg-black/5 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A24A] text-[#00291E] font-bold text-[9px] rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#00291E] text-white rounded-lg shadow-2xl border border-[#C9A24A]/30 py-2 z-30 text-xs animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-white/10 font-serif text-sm text-[#F8F0D8]">
                    Recent Notifications
                  </div>
                  <div className="divide-y divide-white/10 max-h-60 overflow-y-auto">
                    <div className="p-3 hover:bg-white/5 cursor-pointer">
                      <p className="font-semibold text-[#C9A24A]">New Lead: Rahul Sharma</p>
                      <p className="text-[10px] text-white/70">Inquiry for Amrutvan 4 Guntha plot</p>
                      <span className="text-[9px] text-white/40">2 mins ago</span>
                    </div>
                    <div className="p-3 hover:bg-white/5 cursor-pointer">
                      <p className="font-semibold text-[#C9A24A]">Site Visit Request</p>
                      <p className="text-[10px] text-white/70">Sneha Patil for Green Opulence this Sunday</p>
                      <span className="text-[9px] text-white/40">15 mins ago</span>
                    </div>
                    <div className="p-3 hover:bg-white/5 cursor-pointer">
                      <p className="font-semibold text-[#C9A24A]">Plot Inquiries Spike</p>
                      <p className="text-[10px] text-white/70">+12% traffic following new highway announcement</p>
                      <span className="text-[9px] text-white/40">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-[#FFF8E7] hover:bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-full transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-[#00291E] text-[#C9A24A] font-bold text-xs flex items-center justify-center">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left text-[11px] leading-tight">
                  <span className="font-semibold text-[#00291E] block truncate max-w-[120px]">
                    {currentUser?.name ? currentUser.name.split(' ')[0] : 'Admin'}
                  </span>
                  <span className="text-[9px] text-[#26342D]/60 block">
                    {currentUser?.role || 'Administrator'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#26342D]/60" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#00291E] text-white rounded-lg shadow-2xl border border-[#C9A24A]/30 py-1.5 z-30 text-xs animate-in fade-in">
                  <div className="px-3 py-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white truncate">{currentUser?.name || 'Administrator'}</p>
                      <span className="text-[9px] bg-[#C9A24A] text-[#00291E] px-1.5 py-0.5 rounded font-bold uppercase">
                        {currentUser?.role || 'Admin'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/70 truncate mt-0.5">{currentUser?.email || 'admin@veloradevelopers.com'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('users');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-[#C9A24A] font-medium"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Security & Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('home-photos');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Homepage Photos</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('settings');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Contact Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('content');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>CMS Content</span>
                  </button>

                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-300 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
