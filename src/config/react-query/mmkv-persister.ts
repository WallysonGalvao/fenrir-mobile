import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';
import Constants from 'expo-constants';
import type { MMKV } from 'react-native-mmkv';
import { createMMKV } from 'react-native-mmkv';

import { Platform } from 'react-native';

import { ONE_WEEK_IN_MS } from '@/constants';

let queryStorage: MMKV | null = null;
try {
  queryStorage = createMMKV({
    id: `${Constants.expoConfig?.slug || 'sportidia'}.query-cache`,
    // encryptionKey is not supported on web platform
    ...(Platform.OS !== 'web' && {
      encryptionKey: Constants.expoConfig?.slug || 'sportidia',
    }),
  });
} catch {
  // MMKV not available on this platform (e.g., web)
}

export const createMMKVPersister = (): Persister => {
  const CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE';

  return {
    persistClient: async (client: PersistedClient) => {
      if (!queryStorage) return;
      try {
        queryStorage.set(CACHE_KEY, JSON.stringify(client));
      } catch (error) {
        console.error('[MMKV Persister] Error persisting client:', error);
      }
    },
    restoreClient: async () => {
      if (!queryStorage) return undefined;
      try {
        const cached = queryStorage.getString(CACHE_KEY);
        if (!cached) return undefined;

        const client = JSON.parse(cached) as PersistedClient;

        const maxAge = ONE_WEEK_IN_MS;
        const now = Date.now();

        if (now - client.timestamp > maxAge) {
          queryStorage.remove(CACHE_KEY);
          return undefined;
        }

        return client;
      } catch (error) {
        console.error('[MMKV Persister] Error restoring client:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      if (!queryStorage) return;
      try {
        queryStorage.remove(CACHE_KEY);
      } catch (error) {
        console.error('[MMKV Persister] Error removing client:', error);
      }
    },
  };
};
