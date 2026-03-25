import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pressable, StyleSheet, Text, View } from 'react-native';

export function LandingStep({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-surface dark:bg-background-surface-dark justify-center items-center">
      {/* Subtle blue glow edges */}
      <View className="absolute inset-0 border-8 border-primary-glow dark:border-primary-glow-dark" />

      <View className="items-center gap-6 z-1 max-w-100 w-full px-6">
        <Animated.View entering={FadeInDown.duration(400).delay(0)}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.logo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(60)} className="items-center gap-1">
          <Text className="text-[40px] font-extrabold tracking-tighter text-foreground dark:text-foreground-dark">
            {t('auth.appName')}
          </Text>
          <Text className="text-lg leading-6 text-foreground-secondary dark:text-foreground-secondary-dark">
            {t('auth.tagline')}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(120)} className="w-full gap-2 mt-4">
          <Pressable
            className="w-full h-12 rounded-3xl bg-primary dark:bg-primary-dark justify-center items-center active:opacity-85"
            onPress={() => router.push('/sign-up' as Href)}
            accessibilityRole="button"
          >
            <Text className="text-white text-base font-semibold">{t('auth.createAccount')}</Text>
          </Pressable>

          <Pressable
            className="w-full h-12 rounded-3xl bg-button-secondary dark:bg-button-secondary-dark justify-center items-center active:opacity-75"
            onPress={onSignIn}
            accessibilityRole="button"
          >
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 72,
    height: 72,
  },
});
