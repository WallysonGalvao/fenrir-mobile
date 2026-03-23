import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import Constants from 'expo-constants';
import type { MMKV } from 'react-native-mmkv';

import { Platform } from 'react-native';

import { ONE_WEEK_IN_MS } from '@/constants';

export let queryStorage: MMKV | null = null;

function getQueryStorage(): MMKV | null {
  if (queryStorage) return queryStorage;
  if (Platform.OS === 'web' && typeof window === 'undefined') return null;
  try {
    const { createMMKV } = require('react-native-mmkv');
    queryStorage = createMMKV({
      id: `${Constants.expoConfig?.slug || 'sportidia'}.query-cache`,
      ...(Platform.OS !== 'web' && {
        encryptionKey: Constants.expoConfig?.slug || 'sportidia',
      }),
    });
  } catch {
    // MMKV not available on this platform
  }
  return queryStorage;
}

export const createMMKVPersister = (): Persister => {
  const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

  return {
    persistClient: async (client: PersistedClient) => {
      const storage = getQueryStorage();
      if (!storage) return;
      try {
        storage.set(CACHE_KEY, JSON.stringify(client));
      } catch (error) {
        console.error('[MMKV Persister] Error persisting client:', error);
      }
    },
    restoreClient: async () => {
      const storage = getQueryStorage();
      if (!storage) return undefined;
      try {
        const cached = storage.getString(CACHE_KEY);
        if (!cached) return undefined;

        const client = JSON.parse(cached) as PersistedClient;

        const maxAge = ONE_WEEK_IN_MS;
        const now = Date.now();

        if (now - client.timestamp > maxAge) {
          storage.remove(CACHE_KEY);
          return undefined;
        }

        return client;
      } catch (error) {
        console.error('[MMKV Persister] Error restoring client:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      const storage = getQueryStorage();
      if (!storage) return;
      try {
        storage.remove(CACHE_KEY);
      } catch (error) {
        console.error('[MMKV Persister] Error removing client:', error);
      }
    },
  };
};
