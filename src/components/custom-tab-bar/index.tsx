import React from 'react';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { AnimatedTabIndicator } from './animated-tab-indicator';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const indicatorColor = theme.primary;

  const currentRoute = state.routes[state.index];
  const currentDescriptor = descriptors[currentRoute.key];
  const tabBarStyle = currentDescriptor?.options?.tabBarStyle;
  const tabBarStyleObj =
    typeof tabBarStyle === 'object' && !Array.isArray(tabBarStyle)
      ? (tabBarStyle as Record<string, unknown>)
      : null;

  if (tabBarStyleObj?.display === 'none') {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      <AnimatedTabIndicator
        currentIndex={state.index}
        tabCount={state.routes.length}
        color={indicatorColor}
      />

      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const tintColor = isFocused ? theme.primary : theme.textSecondary;

          const labelStyle = [
            styles.tabLabel,
            { color: tintColor },
            isFocused && styles.tabLabelFocused,
          ];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? options.title ?? ''}
              accessibilityHint={t('TAB_HINT', { tab: options.title ?? '' })}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, { borderTopColor: theme.backgroundElement }]}
            >
              <View style={styles.tabContent}>
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: tintColor,
                  size: 24,
                })}
                {options.title ? (
                  <Text style={labelStyle} className="text-xs font-normal">
                    {options.title}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'relative',
    height: Platform.select({ ios: 80, android: 70, default: 60 }),
  },
  tabsRow: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    flex: 1,
    borderTopWidth: 1,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: Platform.select({ ios: 14, android: 8, default: 14 }),
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Sora-Medium',
  },
  tabLabelFocused: {
    fontWeight: '600',
  },
});
