import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();
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

      <View className="items-center gap-3">
        <SymbolView
          name={{ ios: 'envelope.badge.fill', android: 'mark_email_read', web: 'mark_email_read' }}
          size={48}
          tintColor={scheme === 'dark' ? '#3ed6a1' : '#6ccfd1'}
        />
        <Text className="text-[28px] font-extrabold tracking-tight text-foreground dark:text-foreground-dark text-center">
          {t('auth.resetEmailSent')}
        </Text>
        <Text className="text-[15px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark text-center px-4">
          {t('auth.resetEmailSentDescription')}
        </Text>
      </View>

      <View className="flex-1" />

      <Pressable
        className="h-12 bg-primary dark:bg-primary-dark rounded-3xl justify-center items-center active:opacity-75"
        onPress={() => router.replace('/sign-in')}
        accessibilityRole="button"
      >
        <Text className="text-white text-base font-semibold">{t('auth.backToSignIn')}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});
