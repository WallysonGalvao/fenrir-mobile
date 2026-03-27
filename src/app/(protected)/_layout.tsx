import { useCallback, useMemo, useState } from 'react';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';

import { Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DrawerContent, drawerWidths } from '@/components/drawer-content';
import { DrawerLayoutProvider } from '@/components/drawer-layout-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme();
  const isDark = colorScheme === 'dark';
  const isWeb = Platform.OS === 'web';
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const drawerWidth = isWeb
    ? isDrawerCollapsed
      ? drawerWidths.collapsed
      : drawerWidths.expanded
    : undefined;

  const handleToggleDrawerCollapse = useCallback(() => {
    setIsDrawerCollapsed((currentState) => !currentState);
  }, []);

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
    (props: DrawerContentComponentProps) => (
      <DrawerContent
        {...props}
        isCollapsed={isDrawerCollapsed}
        onToggleCollapse={isWeb ? handleToggleDrawerCollapse : undefined}
      />
    ),
    [handleToggleDrawerCollapse, isDrawerCollapsed, isWeb],
  );

  return (
    <ThemeProvider value={navigationTheme}>
      <AnimatedSplashOverlay />
      <DrawerLayoutProvider
        isCollapsed={isDrawerCollapsed}
        toggleCollapse={handleToggleDrawerCollapse}
      >
        <Drawer
          drawerContent={renderDrawerContent}
          screenOptions={{
            headerShown: false,
            drawerType: isWeb ? 'permanent' : 'front',
            drawerStyle: drawerWidth
              ? {
                  width: drawerWidth,
                  backgroundColor: 'transparent',
                  borderRightWidth: 0,
                }
              : undefined,
            overlayColor: isWeb ? 'transparent' : undefined,
            swipeEdgeWidth: isWeb ? 0 : 32,
            sceneStyle: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Drawer.Screen name="(drawer)" options={{ drawerLabel: 'Home', title: 'Home' }} />
        </Drawer>
      </DrawerLayoutProvider>
    </ThemeProvider>
  );
}
