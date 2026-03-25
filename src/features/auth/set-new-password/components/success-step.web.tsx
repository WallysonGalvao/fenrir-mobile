import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/stores/auth';

import { WebSuccessLayout } from '../../shared/web-success-layout';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleGoToSignIn() {
    useSession.setState({ isPasswordRecovery: false });
    router.replace('/sign-in');
  }

  return (
    <WebSuccessLayout
      icon={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
      title={t('auth.passwordUpdated')}
      description={t('auth.passwordUpdatedDescription')}
      buttonLabel={t('auth.backToSignIn')}
      onPress={handleGoToSignIn}
    />
  );
}
