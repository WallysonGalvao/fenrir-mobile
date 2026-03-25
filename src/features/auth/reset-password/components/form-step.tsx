import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text } from 'react-native';

import { FormHeader } from '../../shared/form-header';
import { useResetPassword } from '../context';
import { EmailFormFields } from './email-form-fields';

export function FormStep() {
  const { t } = useTranslation();
  const { onBack } = useResetPassword();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <FormHeader onBack={onBack} backLabel={t('auth.backToSignIn')} />

      <Text className="text-[28px] font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
        {t('auth.resetPassword')}
      </Text>

      <Text className="text-[15px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark -mt-2">
        {t('auth.resetPasswordSubtitle')}
      </Text>

      <EmailFormFields />
    </Animated.View>
  );
}
