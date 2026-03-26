import { useTranslation } from 'react-i18next';

import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/toast';
import { supabase } from '@/lib/supabase';

type SetNewPasswordData = {
  password: string;
  onSuccess: () => void;
};

export function useSetNewPassword() {
  const { t } = useTranslation();
  const toast = useToast();

  async function setNewPassword({ password, onSuccess }: SetNewPasswordData) {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.show({
        id: 'set-new-password-error',
        placement: 'top',
        duration: 4000,
        render: ({ id }) => {
          const uniqueToastId = `toast-${id}`;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="solid">
              <ToastTitle>{t('auth.setNewPassword')}</ToastTitle>
              <ToastDescription>{error.message}</ToastDescription>
            </Toast>
          );
        },
      });
    } else {
      onSuccess();
    }
  }

  return { setNewPassword };
}
