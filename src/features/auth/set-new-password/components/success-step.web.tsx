import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Pressable, Text, View } from 'react-native';

import { useSession } from '@/stores/auth';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();

  function handleGoToSignIn() {
    useSession.setState({ isPasswordRecovery: false });
    router.replace('/sign-in');
  }

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      className="flex-1 bg-background-surface dark:bg-background-surface-dark"
    >
      <View className="absolute inset-0 border-8 border-primary-glow dark:border-primary-glow-dark" />

      <View className="flex-1 justify-center items-center px-16">
        <View className="max-w-100 w-full items-center gap-6">
          <SymbolView
            name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
            size={56}
            tintColor="#6ccfd1"
          />
          <Text className="text-[42px] font-extrabold tracking-tighter text-primary dark:text-primary-dark text-center">
            {t('auth.passwordUpdated')}
          </Text>
          <Text className="text-[17px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark text-center">
            {t('auth.passwordUpdatedDescription')}
          </Text>

          <Pressable
            className="h-10.5 px-8 bg-primary dark:bg-primary-dark rounded-[21px] justify-center items-center active:opacity-75 mt-4"
            onPress={handleGoToSignIn}
            accessibilityRole="button"
          >
            <Text className="text-white text-[15px] font-semibold">{t('auth.backToSignIn')}</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
