import { useTranslation } from 'react-i18next';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/toast';
import { supabase } from '@/lib/supabase';

type SignInData = {
  email: string;
  password: string;
};

export function useSignIn() {
  const { t } = useTranslation();
  const toast = useToast();

  async function signIn({ email, password }: SignInData) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.show({
        id: 'sign-in-error',
        placement: 'top',
        duration: 4000,
        render: ({ id }) => {
          const uniqueToastId = `toast-${id}`;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>{t('auth.signIn')}</ToastTitle>
              <ToastDescription>{error.message}</ToastDescription>
            </Toast>
          );
        },
      });
    }
  }

  return { signIn };
}
