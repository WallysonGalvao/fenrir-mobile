import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

import { getMMKVEncryptionKey } from './storage-key';

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
  // Lazily create the MMKV instance on first access to ensure the encryption
  // key has been initialized by initMMKVEncryptionKey() before use.
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
