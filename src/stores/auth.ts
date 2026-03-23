import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { supabase } from '@/lib/supabase';
import type { InitialStateOnly } from '@/types/common';
import { createMMKVStorage } from '@/utils/storage';

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const initialState: InitialStateOnly<AuthState> = {
  session: null,
  isLoading: true,
};

export const useSession = create<AuthState>()(
  persist(
    () => ({
      ...initialState,

      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => createMMKVStorage('auth-session')),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
