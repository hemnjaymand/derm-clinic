// src/lib/storage/index.ts
import { StorageProvider } from './types';
import { LocalStorage } from './local-storage';
import { ArvanStorage } from './arvan-storage';

// ثابت‌های مورد نیاز در Route Handler
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

let storageInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (storageInstance) return storageInstance;

  const type = process.env.STORAGE_TYPE || 'local';

  if (type === 'local') {
    storageInstance = new LocalStorage();
  } else if (type === 'arvan') {
    storageInstance = new ArvanStorage();
  } else {
    throw new Error(`Unknown storage type: ${type}`);
  }

  return storageInstance;
}