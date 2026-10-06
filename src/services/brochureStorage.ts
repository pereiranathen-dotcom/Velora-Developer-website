/**
 * IndexedDB storage for project brochure documents (PDFs, documents).
 * Allows storing large PDF files (even 10MB - 50MB) without browser localStorage quota constraints.
 */

const DB_NAME = 'velora_brochures_db';
const DB_VERSION = 1;
const STORE_NAME = 'brochures';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'projectId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredBrochure {
  projectId: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  dataUrl: string;
  updatedAt: string;
}

export const BrochureStorage = {
  /**
   * Save a PDF/Document file for a project
   */
  async saveBrochure(
    projectId: string,
    file: File
  ): Promise<{ dataUrl: string; fileName: string; fileSize: string }> {
    const fileName = file.name;
    const sizeInMB = file.size / (1024 * 1024);
    const fileSize =
      sizeInMB < 1
        ? `${Math.round(file.size / 1024)} KB`
        : `${sizeInMB.toFixed(2)} MB`;

    // Read file as Data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file from computer'));
      reader.readAsDataURL(file);
    });

    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const record: StoredBrochure = {
          projectId,
          fileName,
          fileSize,
          mimeType: file.type || 'application/pdf',
          dataUrl,
          updatedAt: new Date().toISOString(),
        };
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Could not store brochure in IndexedDB, using data URL fallback:', err);
    }

    return { dataUrl, fileName, fileSize };
  },

  /**
   * Retrieve brochure data for a project
   */
  async getBrochure(projectId: string): Promise<StoredBrochure | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(projectId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  },

  /**
   * Delete brochure
   */
  async deleteBrochure(projectId: string): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(projectId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Error deleting brochure:', err);
    }
  },

  /**
   * Trigger download of a brochure file in the browser
   */
  downloadBrochure(dataUrlOrBlobUrl: string, fileName = 'Brochure.pdf'): void {
    const a = document.createElement('a');
    a.href = dataUrlOrBlobUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
};
