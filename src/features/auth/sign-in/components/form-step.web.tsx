import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Text, View } from 'react-native';

import { FormFields } from './form-fields';

export function FormStep() {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      className="flex-1 bg-background-surface dark:bg-background-surface-dark"
    >
      {/* Subtle blue glow edges */}
      <View className="absolute inset-0 border-8 border-primary-glow dark:border-primary-glow-dark" />

      <View className="flex-1 flex-row">
        {/* Left column: title (slightly darker bg) */}
        <View className="flex-4 bg-background-surface dark:bg-background-surface-dark justify-center items-end px-16">
          <View className="max-w-90 w-full gap-2">
            <Text className="text-[42px] font-extrabold tracking-tighter text-primary dark:text-primary-dark">
              {t('auth.signIn')}
            </Text>
            <Text className="text-[17px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark">
              {t('auth.signInSubtitle')}
            </Text>
          </View>
        </View>

        {/* Right column: form (lighter bg) */}
        <View className="flex-6 bg-background-surface-alt dark:bg-background-surface-alt-dark justify-center items-start px-16">
          <View className="max-w-120 w-full gap-6">
            <FormFields />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
