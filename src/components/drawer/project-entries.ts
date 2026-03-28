import type { Href } from 'expo-router';

import type { DrawerEntry } from '@/components/drawer/types';

export function getProjectDrawerEntries(slug: string): DrawerEntry[] {
  return [
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
  ];
}
