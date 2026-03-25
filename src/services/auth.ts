import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useSession } from '@/stores/auth';

/**
 * Call once in the root layout's useEffect to wire up the Supabase auth listener.
 * onAuthStateChange fires INITIAL_SESSION immediately, which sets the session
 * and clears the loading state without needing a separate getSession() call.
 * Returns an unsubscribe function to be used as the useEffect cleanup.
 */
export function initAuth() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, updatedSession) => {
    if (event === 'PASSWORD_RECOVERY') {
      useSession.setState({
        session: updatedSession,
        isLoading: false,
        isPasswordRecovery: true,
      });
      router.replace('/set-new-password');
      return;
    }

    useSession.setState({ session: updatedSession, isLoading: false });
  });

  return () => subscription.unsubscribe();
}
