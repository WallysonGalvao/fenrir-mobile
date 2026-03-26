import { useCallback, useMemo } from 'react';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';

import { Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DrawerContent } from '@/components/drawer-content';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme();
  const isDark = colorScheme === 'dark';

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

  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  const isWeb = Platform.OS === 'web';

  return (
    <ThemeProvider value={navigationTheme}>
      <AnimatedSplashOverlay />
      <Drawer
        drawerContent={renderDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerType: isWeb ? 'permanent' : 'front',
          drawerStyle: isWeb ? { width: 280 } : undefined,
        }}
      >
        <Drawer.Screen name="(drawer)" options={{ drawerLabel: 'Home', title: 'Home' }} />
      </Drawer>
    </ThemeProvider>
  );
}
