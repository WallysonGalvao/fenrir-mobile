import { useCallback, useMemo, useState } from 'react';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DrawerContent, drawerWidths } from '@/components/drawer/content';
import { DrawerLayoutProvider } from '@/components/drawer/layout-context';
import { getProjectDrawerEntries } from '@/components/drawer/project-entries';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

const PROJECT_ROUTE_RE = /^\/([^/]+)\/(dashboard|settings)/;

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme();
  const pathname = usePathname();

  const isDark = colorScheme === 'dark';

  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  const projectMatch = PROJECT_ROUTE_RE.exec(pathname);
  const projectSlug = projectMatch ? projectMatch[1] : null;

  const projectEntries = useMemo(
    () => (projectSlug ? getProjectDrawerEntries(projectSlug) : undefined),
    [projectSlug],
  );

  const drawerWidth = isDrawerCollapsed ? drawerWidths.collapsed : drawerWidths.expanded;

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
        onToggleCollapse={handleToggleDrawerCollapse}
        entries={projectEntries}
        title={projectSlug ?? undefined}
      />
    ),
    [handleToggleDrawerCollapse, isDrawerCollapsed, projectEntries, projectSlug],
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
            drawerType: 'permanent',
            drawerStyle: {
              width: drawerWidth,
              backgroundColor: 'transparent',
              borderRightWidth: 0,
            },
            overlayColor: 'transparent',
            swipeEdgeWidth: 0,
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
