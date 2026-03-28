import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

import { Platform } from 'react-native';

import type { Database } from '@/types/supabase';
import { createMMKVStorage } from '@/utils/storage';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project credentials.',
  );
}

const mmkvStorage = createMMKVStorage('supabase-auth');

const supabaseStorage = {
  getItem: (key: string) => mmkvStorage.getItem(key),
  setItem: (key: string, value: string): void => {
    mmkvStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    mmkvStorage.removeItem(key);
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
