import '../config';

import { useEffect } from 'react';

import { BebasNeue_400Regular, useFonts } from '@expo-google-fonts/bebas-neue';
import * as Sentry from '@sentry/react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';

import { useRozeniteDevTools } from '@/hooks/use-rozenite-dev-tools';
import i18n from '@/i18n';
import { initAuth } from '@/services/auth';
import { useSession } from '@/stores/auth';

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useRozeniteDevTools(navigationRef);

  const [fontsLoaded] = useFonts({ BebasNeue_400Regular });

  useEffect(() => initAuth(), []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <RootNavigator />
    </I18nextProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
