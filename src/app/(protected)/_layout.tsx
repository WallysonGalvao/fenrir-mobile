import { useCallback, useMemo } from 'react';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DrawerLayoutProvider } from '@/components/drawer/layout-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme();

  const isDark = colorScheme === 'dark';

  const toggleCollapse = useCallback(() => {}, []);

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.backgroundElement,
        text: colors.text,
        border: colors.backgroundElement,
      },
    }),
    [isDark, colors],
  );

  return (
    <ThemeProvider value={navigationTheme}>
      <AnimatedSplashOverlay />
      <DrawerLayoutProvider isCollapsed={false} toggleCollapse={toggleCollapse}>
        <Slot />
      </DrawerLayoutProvider>
    </ThemeProvider>
  );
}
