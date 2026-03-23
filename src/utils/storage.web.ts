import type { StateStorage } from 'zustand/middleware';

/**
 * Creates a localStorage-based storage adapter to be used
 * with Zustand's `persist` middleware on web.
 *
 * @param storageName - Unique namespace prefix for localStorage keys.
 * @returns An object compatible with Zustand's `StateStorage`.
 */
export const createMMKVStorage = (storageName: string): StateStorage => {
  return {
    setItem: (name, value) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${storageName}:${name}`, value);
      }
    },
    getItem: (name) => {
      if (typeof window === 'undefined') {
        return null;
      }
      return localStorage.getItem(`${storageName}:${name}`) ?? null;
    },
    removeItem: (name) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${storageName}:${name}`);
      }
    },
  };
};
