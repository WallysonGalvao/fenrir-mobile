import { useTranslation } from 'react-i18next';

import { WebFormLayout } from '../../shared/web-form-layout';

import { EmailFormFields } from './email-form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <WebFormLayout title={t('auth.resetPassword')} subtitle={t('auth.resetPasswordSubtitle')}>
      <EmailFormFields />
    </WebFormLayout>
  );
}
