import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { PasswordFormFields } from './password-form-fields';

export function FormStep() {
  const { t } = useTranslation();
  const scheme = useColorScheme();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <View className="items-center">
        <Image
          source={require('@/assets/images/fenrir-logo.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityIgnoresInvertColors
          tintColor={scheme === 'dark' ? 'white' : 'black'}
        />
      </View>

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

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});
