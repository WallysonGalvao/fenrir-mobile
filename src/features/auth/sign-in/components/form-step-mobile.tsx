import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { useSignIn } from '../context';
import { FormFields } from './form-fields';

export function FormStepMobile() {
  const { t } = useTranslation();
  const { onBack } = useSignIn();
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      {/* Header: back arrow + centered logo */}
      <View className="flex-row items-center justify-between">
        <Pressable
          className="w-10 h-10 justify-center items-center active:opacity-60"
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('auth.backToLanding')}
          accessibilityHint={t('auth.backToLandingHint')}
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
          />
        </View>
        {/* Spacer for centering */}
        <View className="w-10 h-10" />
      </View>

      {/* Title */}
      <Text className="text-[28px] font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
        {t('auth.signIn')}
      </Text>

      <FormFields />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});
