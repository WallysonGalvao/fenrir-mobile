import { type PropsWithChildren } from 'react';

import { SymbolView } from 'expo-symbols';

import { Platform, Pressable, Text, View } from 'react-native';

import { useDrawerLayout } from '@/components/drawer-layout-context';
import { useTheme } from '@/hooks/use-theme';

type ProtectedPageShellProps = PropsWithChildren<{
  title: string;
}>;

export function ProtectedPageShell({ children, title }: ProtectedPageShellProps) {
  const { isCollapsed, toggleCollapse } = useDrawerLayout();
  const colors = useTheme();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 bg-background-element p-2">
      <View className="flex-1 overflow-hidden rounded-[28px] border border-border bg-background shadow-black/5">
        <View className="h-14 flex-row items-center gap-3 border-b border-border px-4">
          <Pressable
            onPress={toggleCollapse}
            className="h-9 w-9 items-center justify-center rounded-lg active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={isCollapsed ? 'Expand drawer' : 'Collapse drawer'}
            accessibilityHint="Toggles the sidebar size"
          >
            <SymbolView
              name={{
                ios: 'sidebar.leading',
                android: isCollapsed ? 'left_panel_open' : 'left_panel_close',
                web: isCollapsed ? 'left_panel_open' : 'left_panel_close',
              }}
              size={18}
              tintColor={colors.text}
            />
          </Pressable>

          <View className="h-4 w-px bg-border" />

          <Text className="text-xl font-semibold text-foreground">{title}</Text>
        </View>

        <View className="flex-1 overflow-hidden">{children}</View>
      </View>
    </View>
  );
}
