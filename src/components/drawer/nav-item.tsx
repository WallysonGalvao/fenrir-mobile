import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { type DrawerEntry, isInternalItemActive } from './types';

type DrawerNavItemProps = {
  item: DrawerEntry;
  isCollapsed: boolean;
  pathname: string;
  onPress: () => void;
};

export function DrawerNavItem({ item, isCollapsed, pathname, onPress }: DrawerNavItemProps) {
  const { t } = useTranslation();
  const colors = useTheme();
  const isActive = isInternalItemActive(pathname, item.href);

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border px-3 py-3 active:opacity-80 ${
        isCollapsed ? 'items-center justify-center px-0 py-0' : 'flex-row items-center gap-3'
      } ${
        isActive ? 'border-primary/40 bg-background-element' : 'border-transparent bg-transparent'
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
            <Text className="text-xs text-foreground-secondary">{item.description}</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
