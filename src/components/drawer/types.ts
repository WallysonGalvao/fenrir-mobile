import type { ComponentProps } from 'react';

import type { Href } from 'expo-router';
import type { SymbolView } from 'expo-symbols';

export type DrawerSymbolName = ComponentProps<typeof SymbolView>['name'];

export type DrawerLeafItem = {
  key: string;
  label: string;
  href?: Href;
  externalUrl?: string;
};

export type DrawerEntry = {
  key: string;
  label: string;
  description?: string;
  icon: DrawerSymbolName;
  href?: Href;
  externalUrl?: string;
  items?: DrawerLeafItem[];
};

export function isInternalItemActive(pathname: string, href?: Href) {
  if (!href) return false;

  const targetPath = String(href);
  return pathname === targetPath;
}
