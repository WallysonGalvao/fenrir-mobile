import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text } from 'react-native';

import { FormHeader } from '../../shared/form-header';

import { PasswordFormFields } from './password-form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <FormHeader />

      <Text className="text-[28px] font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
        {t('auth.setNewPassword')}
      </Text>

      <Text className="text-[15px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark -mt-2">
        {t('auth.setNewPasswordSubtitle')}
      </Text>

      <PasswordFormFields />
    </Animated.View>
  );
}
