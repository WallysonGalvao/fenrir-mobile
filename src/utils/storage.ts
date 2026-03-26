import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

import { Platform } from 'react-native';

import { getMMKVEncryptionKey } from './storage-key';

/**
 * web-compatible localStorage adapter for Zustand persistence
 */
const createWebStorage = (storageName: string): StateStorage => {
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
      const value = localStorage.getItem(`${storageName}:${name}`);
      return value ?? null;
    },
    removeItem: (name) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${storageName}:${name}`);
      }
    },
  };
};

/**
 * Creates an MMKV-based storage adapter to be used
 * with Zustand's `persist` middleware.
 *
 * @param storageName - Unique name/identifier for the MMKV instance.
 * @returns An object compatible with Zustand's `StateStorage`.
 *
 * @example
 * import { create } from 'zustand'
 * import { persist } from 'zustand/middleware'
 * import { createMMKVStorage } from './createMMKVStorage'
 *
 * type BearState = {
 *   bears: number
 *   increase: () => void
 * }
 *
 * export const useBearStore = create<BearState>()(
 *   persist(
 *     (set) => ({
 *       bears: 0,
 *       increase: () => set((state) => ({ bears: state.bears + 1 })),
 *     }),
 *     {
 *       name: 'bear-storage',
 *       storage: createMMKVStorage('bear-storage'),
 *     }
 *   )
 * )
 */
export const createMMKVStorage = (storageName: string): StateStorage => {
  // Use localStorage for web platform to avoid SSR issues
  if (Platform.OS === 'web') {
    return createWebStorage(storageName);
  }

  // Lazily create the MMKV instance on first access.
  let mmkvInstance: ReturnType<typeof createMMKV> | null = null;

  function getInstance(): ReturnType<typeof createMMKV> {
    if (!mmkvInstance) {
      mmkvInstance = createMMKV({
        id: storageName,
        encryptionKey: getMMKVEncryptionKey(),
      });
    }
    return mmkvInstance;
  }

  return {
    setItem: (name, value) => {
      getInstance().set(name, value);
    },
    getItem: (name) => {
      const value = getInstance().getString(name);
      return value ?? null;
    },
    removeItem: (name) => {
      getInstance().remove(name);
    },
  };
};
