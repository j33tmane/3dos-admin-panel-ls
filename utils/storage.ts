// Storage utilities for localStorage and sessionStorage

export class StorageService {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  setItem(key: string, value: any): void {
    try {
      const serializedValue =
        typeof value === "string" ? value : JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  getItem<T = any>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) return null;

      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  get length(): number {
    return this.storage.length;
  }
}

// Only create storage services on the client side
export const localStorageService =
  typeof window !== "undefined" ? new StorageService(localStorage) : null;
export const sessionStorageService =
  typeof window !== "undefined" ? new StorageService(sessionStorage) : null;

// Convenience functions with SSR safety
export const setStorageItem = (key: string, value: any): void => {
  if (localStorageService) {
    localStorageService.setItem(key, value);
  }
};

export const getStorageItem = <T = any>(key: string): T | null => {
  if (localStorageService) {
    return localStorageService.getItem<T>(key);
  }
  return null;
};

export const removeStorageItem = (key: string): void => {
  if (localStorageService) {
    localStorageService.removeItem(key);
  }
};

export const clearStorage = (): void => {
  if (localStorageService) {
    localStorageService.clear();
  }
};
