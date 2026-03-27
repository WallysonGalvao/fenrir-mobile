import '../config';
import '../global.css';

import { useEffect } from 'react';

import { BebasNeue_400Regular, useFonts } from '@expo-google-fonts/bebas-neue';
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StyleSheet } from 'react-native';

import { GluestackUIProvider } from '@/components/gluestack-ui-provider';
import { queryClient } from '@/config/react-query';
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
    <GestureHandlerRootView style={styles.gestureHandlerRootView}>
      <GluestackUIProvider mode="system">
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <RootNavigator />
          </I18nextProvider>
        </QueryClientProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { session, isLoading, isPasswordRecovery } = useSession();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session && !isPasswordRecovery}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Protected guard={!session || !!isPasswordRecovery}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
  },
});
