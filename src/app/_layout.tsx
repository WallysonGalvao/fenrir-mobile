import React from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';
import { I18nextProvider } from 'react-i18next';

import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useRozeniteDevTools } from '@/hooks/use-rozenite-dev-tools';
import i18n from '@/i18n';

import '../config';

function TabLayout() {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef();

  useRozeniteDevTools(navigationRef);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default Sentry.wrap(TabLayout);
