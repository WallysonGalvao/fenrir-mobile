import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { type Href, usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Linking, Platform, Text, View } from 'react-native';

import { SafeAreaView } from '../safe-area-view';
import { DrawerHeader } from './header';
import { DrawerNavGroup } from './nav-group';
import { DrawerNavItem } from './nav-item';
import { type DrawerEntry, type DrawerLeafItem, isInternalItemActive } from './types';
import { DrawerUserCard } from './user-card';
import { DrawerUtilityBar } from './utility-bar';

type DrawerContentProps = DrawerContentComponentProps & {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

const iconOnlyDrawerWidth = 88;
const expandedDrawerWidth = 304;

function getOpenGroupsFromEntries(entries: DrawerEntry[], pathname: string) {
  return entries.reduce<Record<string, boolean>>((accumulator, entry) => {
    const hasActiveChild = entry.items?.some((item) => isInternalItemActive(pathname, item.href));
    accumulator[entry.key] = Boolean(hasActiveChild);
    return accumulator;
  }, {});
}

export function DrawerContent({
  isCollapsed = false,
  onToggleCollapse,
  navigation,
}: DrawerContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const isWeb = Platform.OS === 'web';

  const mainEntries = useMemo<DrawerEntry[]>(
    () => [
      {
        key: 'projects',
        label: t('drawer.items.projects'),
        description: t('drawer.descriptions.projects'),
        href: '/' as Href,
        icon: {
          ios: 'square.grid.2x2.fill',
          android: 'dashboard',
          web: 'dashboard',
        },
      },
      {
        key: 'explore',
        label: t('drawer.items.explore'),
        description: t('drawer.descriptions.explore'),
        href: '/explore' as Href,
        icon: {
          ios: 'sparkles',
          android: 'explore',
          web: 'explore',
        },
      },
    ],
    [t],
  );

  const groupedEntries = useMemo<DrawerEntry[]>(
    () => [
      {
        key: 'workspace',
        label: t('drawer.groups.workspace'),
        icon: {
          ios: 'rectangle.3.group.fill',
          android: 'grid_view',
          web: 'grid_view',
        },
        items: [
          {
            key: 'all-projects',
            label: t('drawer.items.allProjects'),
            href: '/' as Href,
          },
          {
            key: 'layout-reference',
            label: t('drawer.items.layoutReference'),
            href: '/explore' as Href,
          },
        ],
      },
      {
        key: 'resources',
        label: t('drawer.groups.resources'),
        icon: {
          ios: 'book.closed.fill',
          android: 'menu_book',
          web: 'menu_book',
        },
        items: [
          {
            key: 'expo-docs',
            label: t('drawer.items.expoDocs'),
            externalUrl: 'https://docs.expo.dev',
          },
          {
            key: 'router-guide',
            label: t('drawer.items.routerGuide'),
            externalUrl: 'https://docs.expo.dev/router/introduction/',
          },
        ],
      },
    ],
    [t],
  );

  const utilityEntries = useMemo<DrawerEntry[]>(
    () => [
      {
        key: 'help',
        label: t('drawer.items.help'),
        externalUrl: 'https://docs.expo.dev',
        icon: {
          ios: 'questionmark.circle',
          android: 'help',
          web: 'help',
        },
      },
      {
        key: 'search',
        label: t('drawer.items.search'),
        href: '/explore' as Href,
        icon: {
          ios: 'magnifyingglass',
          android: 'search',
          web: 'search',
        },
      },
    ],
    [t],
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getOpenGroupsFromEntries(groupedEntries, pathname),
  );

  useEffect(() => {
    setOpenGroups((currentGroups) => {
      const nextGroups = getOpenGroupsFromEntries(groupedEntries, pathname);

      return groupedEntries.reduce<Record<string, boolean>>((accumulator, entry) => {
        accumulator[entry.key] = currentGroups[entry.key] || nextGroups[entry.key];
        return accumulator;
      }, {});
    });
  }, [groupedEntries, pathname]);

  const closeMobileDrawer = useCallback(() => {
    if (!isWeb) navigation.closeDrawer();
  }, [isWeb, navigation]);

  const handleNavigate = useCallback(
    async (item: DrawerLeafItem | DrawerEntry) => {
      if (item.href) {
        router.push(item.href);
        closeMobileDrawer();
        return;
      }

      if (item.externalUrl) {
        await Linking.openURL(item.externalUrl);
        closeMobileDrawer();
      }
    },
    [closeMobileDrawer, router],
  );

  const handleToggleGroup = useCallback(
    (groupKey: string) => {
      if (isWeb && isCollapsed) {
        onToggleCollapse?.();
        setOpenGroups((currentGroups) => ({ ...currentGroups, [groupKey]: true }));
        return;
      }

      setOpenGroups((currentGroups) => ({
        ...currentGroups,
        [groupKey]: !currentGroups[groupKey],
      }));
    },
    [isCollapsed, isWeb, onToggleCollapse],
  );

  return (
    <SafeAreaView className="flex-1 bg-background-element web:min-h-screen">
      <View className="flex-1 bg-background-element">
        <DrawerHeader isCollapsed={isCollapsed} />

        <DrawerContentScrollView
          contentContainerClassName="gap-6 px-3 py-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2">
            {!isCollapsed ? (
              <Text className="px-3 text-[11px] font-medium uppercase tracking-[2px] text-foreground-secondary">
                {t('drawer.sections.main')}
              </Text>
            ) : null}

            {mainEntries.map((item) => (
              <DrawerNavItem
                key={item.key}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
                onPress={() => void handleNavigate(item)}
              />
            ))}
          </View>

          <View className="gap-2">
            {!isCollapsed ? (
              <Text className="px-3 text-[11px] font-medium uppercase tracking-[2px] text-foreground-secondary">
                {t('drawer.sections.collections')}
              </Text>
            ) : null}

            {groupedEntries.map((group) => (
              <Fragment key={group.key}>
                <DrawerNavGroup
                  group={group}
                  isCollapsed={isCollapsed}
                  pathname={pathname}
                  isOpen={Boolean(openGroups[group.key])}
                  onToggle={() => handleToggleGroup(group.key)}
                  onNavigate={(item) => void handleNavigate(item)}
                />
              </Fragment>
            ))}
          </View>
        </DrawerContentScrollView>

        <View className={`gap-3 p-3 ${isCollapsed ? 'items-center' : ''}`}>
          <DrawerUtilityBar
            entries={utilityEntries}
            isCollapsed={isCollapsed}
            pathname={pathname}
            onPress={(item) => void handleNavigate(item)}
          />

          <DrawerUserCard isCollapsed={isCollapsed} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export const drawerWidths = {
  collapsed: iconOnlyDrawerWidth,
  expanded: expandedDrawerWidth,
};
