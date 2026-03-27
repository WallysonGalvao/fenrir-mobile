import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { type DrawerEntry, isInternalItemActive } from './types';

type DrawerUtilityBarProps = {
  entries: DrawerEntry[];
  isCollapsed: boolean;
  pathname: string;
  onPress: (item: DrawerEntry) => void;
};

export function DrawerUtilityBar({
  entries,
  isCollapsed,
  pathname,
  onPress,
}: DrawerUtilityBarProps) {
  const { t } = useTranslation();
  const colors = useTheme();

  return (
    <View className={`gap-1 ${isCollapsed ? 'items-center' : ''}`}>
      {entries.map((item) => {
        const isActive = isInternalItemActive(pathname, item.href);

        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item)}
            className={`rounded-xl px-3 py-2.5 active:opacity-80 ${
              isCollapsed ? 'h-11 w-11 items-center justify-center' : 'flex-row items-center gap-3'
            } ${isActive ? 'bg-background-element' : 'bg-transparent web:hover:bg-foreground/5'}`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityHint={t('drawer.hints.navigate')}
            accessibilityState={{ selected: isActive }}
          >
            <SymbolView name={item.icon} size={18} tintColor={colors.textSecondary} />
            {!isCollapsed ? <Text className="text-sm text-foreground">{item.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}
