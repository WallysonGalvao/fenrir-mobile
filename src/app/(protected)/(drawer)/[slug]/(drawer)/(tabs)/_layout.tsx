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

export default function ProjectTabsLayout() {
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

  if (Platform.OS === 'web') {
    return <Slot />;
  }

  if (!isIOS26OrLater) {
    return (
      <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="dashboard"
          options={{
            title: t('tabs.dashboard'),
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'square.grid.2x2.fill', android: 'dashboard', web: 'dashboard' }}
                size={24}
                tintColor={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
                size={24}
                tintColor={color}
              />
            ),
          }}
        />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      tintColor={tintColor}
      iconColor={inactiveTintColor}
      labelStyle={{ color: inactiveTintColor }}
      labelVisibilityMode="labeled"
      indicatorColor={tintColor + '40'}
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="dashboard">
        <NativeTabs.Trigger.Label selectedStyle={labelSelectedStyle}>
          {t('tabs.dashboard')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" md="dashboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label selectedStyle={labelSelectedStyle}>
          {t('tabs.settings')}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
