import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { WebSuccessLayout } from '../../shared/web-success-layout';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <WebSuccessLayout
      icon={{ ios: 'envelope.badge.fill', android: 'mark_email_read', web: 'mark_email_read' }}
      title={t('auth.resetEmailSent')}
      description={t('auth.resetEmailSentDescription')}
      buttonLabel={t('auth.backToSignIn')}
      onPress={() => router.replace('/sign-in')}
    />
  );
}
