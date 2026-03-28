import React from 'react';

import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Slot, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { DynamicColorIOS, Platform } from 'react-native';

import { CustomTabBar } from '@/components/custom-tab-bar';
import { Colors } from '@/constants/theme';
import { useIsIOS26OrLater } from '@/hooks/use-is-ios26-or-later';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isIOS26OrLater = useIsIOS26OrLater();
  const hasLiquidGlass = isLiquidGlassAvailable();

  const tintColor = theme.primary;
  const inactiveTintColor =
    Platform.OS === 'ios' && hasLiquidGlass
      ? DynamicColorIOS({
          light: Colors.light.textSecondary,
          dark: Colors.dark.textSecondary,
        })
      : theme.textSecondary;

  const labelSelectedStyle = Platform.OS === 'ios' ? { color: tintColor } : undefined;

  if (!isIOS26OrLater) {
    return (
      <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'house.fill', android: 'home', web: 'home' }}
                size={24}
                tintColor={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: t('tabs.explore'),
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'safari.fill', android: 'explore', web: 'explore' }}
                size={24}
                tintColor={color}
              />
            ),
          }}
        />
      </Tabs>
    );
  }

  if (Platform.OS === 'web') {
    return <Slot />;
  }

  return (
    <NativeTabs
      tintColor={theme.primary}
      iconColor={inactiveTintColor}
      labelStyle={{ color: inactiveTintColor }}
      labelVisibilityMode="labeled"
      indicatorColor={theme.primary + '40'}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label selectedStyle={labelSelectedStyle}>
          {t('tabs.home')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label selectedStyle={labelSelectedStyle}>
          {t('tabs.explore')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="safari.fill" md="explore" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
