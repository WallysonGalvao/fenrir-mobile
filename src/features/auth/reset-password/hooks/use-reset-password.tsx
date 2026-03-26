import { useTranslation } from 'react-i18next';

import { Platform } from 'react-native';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/toast';
import { supabase } from '@/lib/supabase';

type ResetPasswordData = {
  email: string;
  onSuccess: () => void;
};

function getRedirectUrl() {
  if (Platform.OS === 'web') {
    return `${window.location.origin}/set-new-password`;
  }
  return 'fenrir://set-new-password';
}

export function useResetPassword() {
  const { t } = useTranslation();
  const toast = useToast();

  async function resetPassword({ email, onSuccess }: ResetPasswordData) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl(),
    });

    if (error) {
      toast.show({
        id: 'reset-password-error',
        placement: 'top',
        duration: 4000,
        render: ({ id }) => {
          const uniqueToastId = `toast-${id}`;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>{t('auth.resetPassword')}</ToastTitle>
              <ToastDescription>{error.message}</ToastDescription>
            </Toast>
          );
        },
      });
    } else {
      onSuccess();
    }
  }

  return { resetPassword };
}
