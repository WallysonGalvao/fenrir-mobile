import { Image, ImageBackground } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import landingBgDark from '@/assets/images/landing-bg-dark.png';
import landingBg from '@/assets/images/landing-bg.png';

export function LandingStepMobile({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();

  const scheme = useColorScheme();

  return (
    <ImageBackground
      source={scheme === 'dark' ? landingBgDark : landingBg}
      style={styles.background}
      contentFit="cover"
    >
      {/* Dark overlay for readability */}
      <View className="absolute inset-0 bg-black/15" />

      {/* Logo + name centered in the upper area */}
      <View className="items-center gap-2 z-1">
        <Animated.View entering={FadeInDown.duration(500).delay(0)}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.logo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
            tintColor={scheme === 'dark' ? '#3ED6A1' : '#4D4088'}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(80)}>
          <Text
            className="text-3xl font-extrabold tracking-tight text-[#4D4088] dark:text-[#3ED6A1]"
            style={[styles.textShadowLanding, styles.appNameText]}
          >
            {t('auth.appName')}
          </Text>
        </Animated.View>
      </View>

      {/* Buttons pinned to bottom */}
      <Animated.View
        entering={FadeInDown.duration(500).delay(160)}
        className="w-full max-w-100 self-center gap-4 items-center z-1"
      >
        <Pressable
          className="w-full h-13 rounded-[26px] justify-center items-center bg-white/92 active:opacity-80"
          onPress={() => router.push('/sign-up' as Href)}
          accessibilityRole="button"
        >
          <Text className="text-[17px] font-semibold text-button-secondary-text">
            {t('auth.createAccount')}
          </Text>
        </Pressable>

        <Pressable className="py-2 active:opacity-60" onPress={onSignIn} accessibilityRole="button">
          <Text className="text-[17px] font-semibold text-white" style={styles.textShadowButton}>
            {t('auth.signIn')}
          </Text>
        </Pressable>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  logo: {
    width: 82,
    height: 82,
  },
  textShadowLanding: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  appNameText: {
    fontFamily: 'BebasNeue_400Regular',
  },
  textShadowButton: {
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
