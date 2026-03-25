import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { useResetPassword } from '../context';
import { EmailFormFields } from './email-form-fields';

export function FormStep() {
  const { t } = useTranslation();
  const { onBack } = useResetPassword();
  const theme = useTheme();
  const scheme = useColorScheme();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <View className="flex-row items-center justify-between">
        <Pressable
          className="w-10 h-10 justify-center items-center active:opacity-60"
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('auth.backToSignIn')}
        >
          <SymbolView
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            size={22}
            tintColor={theme.text}
          />
        </Pressable>
        <View className="items-center">
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.logo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
            tintColor={scheme === 'dark' ? 'white' : 'black'}
          />
        </View>
        <View className="w-10 h-10" />
      </View>

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

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});
