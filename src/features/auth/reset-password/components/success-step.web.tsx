import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Pressable, Text } from 'react-native';

export function SuccessStep() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      className="w-full max-w-md items-center gap-6 self-center px-8"
    >
      <SymbolView
        name={{ ios: 'envelope.badge.fill', android: 'mark_email_read', web: 'mark_email_read' }}
        size={56}
        tintColor="#6ccfd1"
      />
      <Text className="text-center text-[42px] font-extrabold tracking-tighter text-primary dark:text-primary-dark">
        {t('auth.resetEmailSent')}
      </Text>
      <Text className="text-center text-[17px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark">
        {t('auth.resetEmailSentDescription')}
      </Text>
      <Pressable
        className="mt-4 h-10.5 items-center justify-center rounded-[21px] bg-primary px-8 active:opacity-75 dark:bg-primary-dark"
        onPress={() => router.replace('/sign-in')}
        accessibilityRole="button"
      >
        <Text className="text-[15px] font-semibold text-white">{t('auth.backToSignIn')}</Text>
      </Pressable>
    </Animated.View>
  );
}
