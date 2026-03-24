import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { createMMKVStorage } from '@/utils/storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const storage = createMMKVStorage('supabase-auth');

// Wrap the adapter with explicit void returns to satisfy Supabase's SupportedStorage types
const MMKVStorageAdapter = {
  getItem: (key: string) => storage.getItem(key),
  setItem: (key: string, value: string) => {
    storage.setItem(key, value);
  },
  removeItem: (key: string) => {
    storage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: MMKVStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
