import { useTranslation } from 'react-i18next';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/toast';
import { supabase } from '@/lib/supabase';

type SignUpData = {
  email: string;
  password: string;
  onSuccess: () => void;
};

export function useSignUp() {
  const { t } = useTranslation();
  const toast = useToast();

  async function signUp({ email, password, onSuccess }: SignUpData) {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.show({
        id: 'sign-up-error',
        placement: 'top',
        duration: 4000,
        render: ({ id }) => {
          const uniqueToastId = `toast-${id}`;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>{t('auth.signUp')}</ToastTitle>
              <ToastDescription>{error.message}</ToastDescription>
            </Toast>
          );
        },
      });
    } else {
      onSuccess();
    }
  }

  return { signUp };
}
