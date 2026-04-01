import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { ScrollView, View } from 'react-native';

import logo from '@/assets/images/fenrir-logo.png';
import { SafeAreaView } from '@/components/safe-area-view';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        accessibilityRole="scrollbar"
        className="flex-1"
        accessible
        accessibilityLabel={t('auth.scrollArea')}
        accessibilityHint={t('auth.scrollAreaHint')}
      >
        <View className="min-h-screen flex-1 flex-row">
          <Animated.View
            entering={FadeIn.duration(500).delay(100).easing(Easing.inOut(Easing.ease))}
            exiting={FadeOut.duration(400).easing(Easing.inOut(Easing.ease))}
            accessible
            accessibilityRole="image"
            accessibilityLabel={t('auth.logo')}
            accessibilityHint={t('auth.logoHint')}
            className="hidden flex-1 items-center justify-center bg-primary dark:bg-primary md:flex"
          >
            <Image
              className="aspect-3/4 w-full max-w-md shrink"
              source={logo}
              contentFit="contain"
              accessible
              accessibilityLabel={t('auth.logo')}
              accessibilityHint={t('auth.logoHint')}
              accessibilityIgnoresInvertColors
            />
          </Animated.View>

          <View
            importantForAccessibility="yes"
            className="flex-1 justify-center gap-10 bg-transparent"
          >
            {children}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
