import { useCallback, useMemo } from 'react';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { type Href, Slot, useLocalSearchParams } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { Platform } from 'react-native';

import { DrawerContent } from '@/components/drawer/content';
import { type DrawerEntry } from '@/components/drawer/types';

export default function ProjectLayout() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const entries = useMemo<DrawerEntry[]>(
    () => [
      {
        key: 'dashboard',
        label: 'Dashboard',
        href: `/${slug}/dashboard` as Href,
        icon: { ios: 'square.grid.2x2.fill', android: 'dashboard', web: 'dashboard' },
      },
      {
        key: 'settings',
        label: 'Settings',
        href: `/${slug}/settings` as Href,
        icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
      },
    ],
    [slug],
  );

  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => (
      <DrawerContent {...props} entries={entries} title={slug} />
    ),
    [entries, slug],
  );

  if (Platform.OS === 'web') {
    return <Slot />;
  }

  return (
    <Drawer
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEdgeWidth: 32,
      }}
    >
      <Drawer.Screen name="(drawer)" />
    </Drawer>
  );
}
