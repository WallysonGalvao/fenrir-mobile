import { useTranslation } from 'react-i18next';

import { WebFormLayout } from '../../shared/web-form-layout';

import { PasswordFormFields } from './password-form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <WebFormLayout title={t('auth.setNewPassword')} subtitle={t('auth.setNewPasswordSubtitle')}>
      <PasswordFormFields />
    </WebFormLayout>
  );
}
