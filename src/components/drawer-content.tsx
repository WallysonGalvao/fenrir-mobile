import { type ComponentProps, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { type Href, usePathname, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/stores/auth';

import { SafeAreaView } from './safe-area-view';

type DrawerContentProps = DrawerContentComponentProps & {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

type DrawerSymbolName = ComponentProps<typeof SymbolView>['name'];

type DrawerLeafItem = {
  key: string;
  label: string;
  href?: Href;
  externalUrl?: string;
};

type DrawerEntry = {
  key: string;
  label: string;
  description?: string;
  icon: DrawerSymbolName;
  href?: Href;
  externalUrl?: string;
  items?: DrawerLeafItem[];
};

const iconOnlyDrawerWidth = 88;
const expandedDrawerWidth = 304;

const linearTransition = LinearTransition.springify().damping(20).stiffness(220);

function isInternalItemActive(pathname: string, href?: Href) {
  if (!href) return false;

  const targetPath = String(href);
  return pathname === targetPath;
}

function getItemInitial(label: string) {
  return label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

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
  const colors = useTheme();
  const session = useSession((state) => state.session);
  const signOut = useSession((state) => state.signOut);
  const isWeb = Platform.OS === 'web';

  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.user_metadata?.full_name ?? userEmail.split('@')[0] ?? '';
  const userInitials = getItemInitial(userName || 'Fenrir');

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

  const handleSignOut = useCallback(async () => {
    await signOut();
    closeMobileDrawer();
  }, [closeMobileDrawer, signOut]);

  return (
    <SafeAreaView className="flex-1 bg-background-element web:min-h-screen">
      <View className="flex-1 bg-background-element">
        <View
          className={`flex-row items-center gap-3 px-4 py-4 ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <View className={`flex-row items-center gap-3 ${isCollapsed ? '' : 'flex-1'}`}>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-background-element">
              <Image
                source={require('@/assets/images/fenrir-logo.png')}
                style={styles.image}
                tintColor={colors.text}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </View>

            {!isCollapsed ? (
              <View className="flex-1">
                <Text className="text-[11px] font-medium uppercase tracking-[2.5px] text-foreground-secondary">
                  {t('drawer.eyebrow')}
                </Text>
                <Text className="text-xl font-semibold text-foreground">{t('auth.appName')}</Text>
              </View>
            ) : null}
          </View>
        </View>

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

            {mainEntries.map((item) => {
              const isActive = isInternalItemActive(pathname, item.href);

              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavigate(item)}
                  className={`rounded-2xl border px-3 py-3 active:opacity-80 ${
                    isCollapsed
                      ? 'items-center justify-center px-0 py-0'
                      : 'flex-row items-center gap-3'
                  } ${
                    isActive
                      ? 'border-primary/40 bg-background-element'
                      : 'border-transparent bg-transparent'
                  } ${isCollapsed ? 'h-14 w-14 self-center' : ''}`}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityHint={t('drawer.hints.navigate')}
                  accessibilityState={{ selected: isActive }}
                >
                  <View
                    className={`items-center justify-center rounded-xl ${
                      isCollapsed ? 'h-10 w-10' : 'h-10 w-10 bg-background-element'
                    }`}
                  >
                    <SymbolView name={item.icon} size={20} tintColor={colors.text} />
                  </View>

                  {!isCollapsed ? (
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
                      {item.description ? (
                        <Text className="text-xs text-foreground-secondary">
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View className="gap-2">
            {!isCollapsed ? (
              <Text className="px-3 text-[11px] font-medium uppercase tracking-[2px] text-foreground-secondary">
                {t('drawer.sections.collections')}
              </Text>
            ) : null}

            {groupedEntries.map((group) => {
              const isOpen = openGroups[group.key];
              const hasActiveChild = Boolean(
                group.items?.some((item) => isInternalItemActive(pathname, item.href)),
              );

              return (
                <Fragment key={group.key}>
                  <Pressable
                    onPress={() => handleToggleGroup(group.key)}
                    className={`rounded-2xl border px-3 py-3 active:opacity-80 ${
                      isCollapsed
                        ? 'items-center justify-center px-0 py-0'
                        : 'flex-row items-center gap-3'
                    } ${
                      hasActiveChild || isOpen
                        ? 'border-primary/35 bg-background-element'
                        : 'border-transparent bg-transparent'
                    } ${isCollapsed ? 'h-14 w-14 self-center' : ''}`}
                    accessibilityRole="button"
                    accessibilityLabel={group.label}
                    accessibilityHint={t('drawer.actions.toggleGroup')}
                    accessibilityState={{ expanded: isOpen }}
                  >
                    <View
                      className={`items-center justify-center rounded-xl ${
                        isCollapsed ? 'h-10 w-10' : 'h-10 w-10 bg-background-element'
                      }`}
                    >
                      <SymbolView name={group.icon} size={20} tintColor={colors.text} />
                    </View>

                    {!isCollapsed ? (
                      <>
                        <Text className="flex-1 text-sm font-semibold text-foreground">
                          {group.label}
                        </Text>
                        <SymbolView
                          name={{
                            ios: 'chevron.down',
                            android: 'expand_more',
                            web: 'expand_more',
                          }}
                          size={18}
                          tintColor={colors.text}
                          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                        />
                      </>
                    ) : null}
                  </Pressable>

                  {!isCollapsed && isOpen && group.items?.length ? (
                    <Animated.View
                      layout={linearTransition}
                      entering={FadeInDown.duration(180)}
                      exiting={FadeOutUp.duration(140)}
                      className="ml-6 gap-1 border-l border-border pl-4"
                    >
                      {group.items.map((item) => {
                        const isChildActive = isInternalItemActive(pathname, item.href);

                        return (
                          <Pressable
                            key={item.key}
                            onPress={() => handleNavigate(item)}
                            className={`rounded-xl px-3 py-3 active:opacity-80 ${
                              isChildActive ? 'bg-background-element' : 'bg-transparent'
                            }`}
                            accessibilityRole="button"
                            accessibilityLabel={item.label}
                            accessibilityHint={t('drawer.hints.navigate')}
                            accessibilityState={{ selected: isChildActive }}
                          >
                            <Text
                              className={`text-sm ${
                                isChildActive
                                  ? 'font-semibold text-foreground'
                                  : 'text-foreground-secondary'
                              }`}
                            >
                              {item.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </Animated.View>
                  ) : null}
                </Fragment>
              );
            })}
          </View>
        </DrawerContentScrollView>

        <View className={`gap-3 p-3 ${isCollapsed ? 'items-center' : ''}`}>
          <View className={`flex-row gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
            {utilityEntries.map((item) => {
              const isActive = isInternalItemActive(pathname, item.href);

              return (
                <Pressable
                  key={item.key}
                  onPress={() => handleNavigate(item)}
                  className={`rounded-xl border px-3 py-3 active:opacity-80 ${
                    isCollapsed
                      ? 'h-11 w-11 items-center justify-center px-0 py-0'
                      : 'flex-1 flex-row items-center gap-2'
                  } ${
                    isActive
                      ? 'border-primary/35 bg-background-element'
                      : 'border-border bg-transparent'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityHint={t('drawer.hints.navigate')}
                  accessibilityState={{ selected: isActive }}
                >
                  <SymbolView name={item.icon} size={18} tintColor={colors.text} />
                  {!isCollapsed ? (
                    <Text className="text-sm font-medium text-foreground">{item.label}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View
            className={`rounded-3xl border border-border bg-background px-3 py-3 ${
              isCollapsed ? 'items-center' : 'gap-3'
            }`}
          >
            <View className={`flex-row items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary">
                <Text className="text-sm font-bold text-primary-foreground">{userInitials}</Text>
              </View>

              {!isCollapsed ? (
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                    {userName}
                  </Text>
                  <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
              ) : null}
            </View>

            <Pressable
              onPress={() => void handleSignOut()}
              className={`rounded-xl bg-background-element px-3 py-3 active:opacity-80 ${
                isCollapsed
                  ? 'h-11 w-11 items-center justify-center px-0 py-0'
                  : 'flex-row items-center justify-center gap-2'
              }`}
              accessibilityRole="button"
              accessibilityLabel={t('drawer.actions.signOut')}
              accessibilityHint={t('drawer.hints.signOut')}
            >
              <SymbolView
                name={{
                  ios: 'rectangle.portrait.and.arrow.right',
                  android: 'logout',
                  web: 'logout',
                }}
                size={18}
                tintColor={colors.text}
              />
              {!isCollapsed ? (
                <Text className="text-sm font-semibold text-foreground">
                  {t('drawer.actions.signOut')}
                </Text>
              ) : null}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const drawerWidths = {
  collapsed: iconOnlyDrawerWidth,
  expanded: expandedDrawerWidth,
};

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
  },
});
