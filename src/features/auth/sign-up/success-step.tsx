import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { SuccessLayout } from '../components/success-layout';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SuccessLayout
      icon={{ ios: 'envelope.badge.fill', android: 'mark_email_read', web: 'mark_email_read' }}
      title={t('auth.checkEmail')}
      description={t('auth.checkEmailDescription')}
      buttonLabel={t('auth.backToSignIn')}
      onPress={() => router.replace('/sign-in')}
    />
  );
}
