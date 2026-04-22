type StorageValue = string | number | boolean | object | null;

const isClient = typeof window !== "undefined";

export const storageService = {
  
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}"`, error);
      return null;
    }
  },

  setItem: (key: string, value: StorageValue): void => {
    if (!isClient) return;
    try {
      const val =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : String(value);
      localStorage.setItem(key, val);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}"`, error);
    }
  },

  removeItem: (key: string): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}"`, error);
    }
  },

  getJSON: <T = any>(key: string): T | null => {
    if (!isClient) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing JSON key "${key}"`, error);
      return null;
    }
  },
};