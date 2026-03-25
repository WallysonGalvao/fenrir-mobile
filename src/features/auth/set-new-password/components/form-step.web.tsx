import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text, View } from 'react-native';

import { PasswordFormFields } from './password-form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      className="w-full max-w-md gap-6 self-center px-8"
    >
      <View className="gap-2">
        <Text className="text-[42px] font-extrabold tracking-tighter text-primary dark:text-primary-dark">
          {t('auth.setNewPassword')}
        </Text>
        <Text className="text-[17px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark">
          {t('auth.setNewPasswordSubtitle')}
        </Text>
      </View>
      <PasswordFormFields />
    </Animated.View>
  );
}
