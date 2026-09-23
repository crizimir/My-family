/**
 * High-performance, high-capacity image storage and processing using IndexedDB and Canvas.
 * Handles high-resolution camera photos directly from mobile phones and desktops without 5MB localStorage quota errors.
 */

const DB_NAME = 'cuares_family_media_v1';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Optimizes an uploaded File into a high-quality data URL (max 1800px, 90% quality JPEG)
 * to keep image razor-sharp while ensuring instant loading and no memory lag.
 */
export async function processImageFile(file: File, maxDimension = 1800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.90);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Persists an image data URL to IndexedDB under a designated key.
 */
export async function saveMediaAsset(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ key, dataUrl, updatedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB save fallback to localStorage:', err);
    try {
      localStorage.setItem(`media_${key}`, dataUrl);
    } catch {
      // ignore
    }
  }
}

/**
 * Loads a media asset from IndexedDB.
 */
export async function getMediaAsset(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result?.dataUrl) {
          resolve(request.result.dataUrl);
        } else {
          // fallback to localStorage
          resolve(localStorage.getItem(`media_${key}`));
        }
      };
      request.onerror = () => {
        resolve(localStorage.getItem(`media_${key}`));
      };
    });
  } catch {
    return localStorage.getItem(`media_${key}`);
  }
}
