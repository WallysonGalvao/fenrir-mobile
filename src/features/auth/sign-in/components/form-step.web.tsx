import { useTranslation } from 'react-i18next';

import { WebFormLayout } from '../../shared/web-form-layout';
import { FormFields } from './form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <WebFormLayout title={t('auth.signIn')} subtitle={t('auth.signInSubtitle')}>
      <FormFields />
    </WebFormLayout>
  );
}
