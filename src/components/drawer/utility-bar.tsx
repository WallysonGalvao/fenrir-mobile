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
    <View className={`flex-row gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
      {entries.map((item) => {
        const isActive = isInternalItemActive(pathname, item.href);

        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item)}
            className={`rounded-xl border px-3 py-3 active:opacity-80 ${
              isCollapsed
                ? 'h-11 w-11 items-center justify-center px-0 py-0'
                : 'flex-1 flex-row items-center gap-2'
            } ${
              isActive ? 'border-primary/35 bg-background-element' : 'border-border bg-transparent'
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
  );
}
