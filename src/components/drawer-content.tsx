import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/stores/auth';

import { SafeAreaView } from './safe-area-view';

type DrawerContentProps = DrawerContentComponentProps & {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function DrawerContent({
  isCollapsed = false,
  onToggleCollapse,
  ...props
}: DrawerContentProps) {
  const session = useSession((s) => s.session);

  const colors = useTheme();
  const isWeb = Platform.OS === 'web';

  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.user_metadata?.full_name ?? userEmail.split('@')[0] ?? '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* ── Header: Logo + App Name ── */}
      <View
        className={`flex-row items-center px-4 web:py-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        <View className={`flex-row items-center gap-3 ${isCollapsed ? 'justify-center' : 'flex-1'}`}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.image}
            className="h-9 w-9"
            tintColor={colors.text}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
          {!isCollapsed ? <Text className="text-xl font-semibold text-foreground">Fenrir</Text> : null}
        </View>

        {isWeb ? (
          <Pressable
            onPress={onToggleCollapse}
            className="h-11 w-11 items-center justify-center rounded-lg active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={isCollapsed ? 'Expand drawer' : 'Collapse drawer'}
            accessibilityHint="Toggles the sidebar size on web"
          >
            <SymbolView
              name={{
                ios: isCollapsed ? 'sidebar.left' : 'sidebar.leading',
                android: isCollapsed ? 'left_panel_open' : 'left_panel_close',
                web: isCollapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left',
              }}
              size={20}
              tintColor={colors.text}
            />
          </Pressable>
        ) : null}
      </View>

      {/* ── Drawer Items ── */}
      <DrawerContentScrollView
        {...props}
        contentContainerClassName={`px-3 ${isCollapsed ? 'items-center' : ''}`}
      >
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key];
          const label = options.drawerLabel ?? options.title ?? route.name;
          const isFocused = props.state.index === index;
          const stringLabel = typeof label === 'string' ? label : route.name;
          const compactLabel = stringLabel.charAt(0).toUpperCase();

          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name)}
              className={`mb-1 rounded-lg active:opacity-70 ${
                isCollapsed ? 'h-12 w-12 items-center justify-center px-0 py-0' : 'px-4 py-3'
              } ${isFocused ? 'bg-background-element' : ''}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={stringLabel}
              accessibilityHint={`Navigate to ${stringLabel}`}
            >
              {isCollapsed ? (
                <Text
                  className={`text-base font-semibold ${isFocused ? 'text-foreground' : 'text-foreground-secondary'}`}
                >
                  {compactLabel}
                </Text>
              ) : (
                <Text
                  className={`text-base font-medium ${isFocused ? 'text-foreground' : 'text-foreground-secondary'}`}
                >
                  {stringLabel}
                </Text>
              )}
            </Pressable>
          );
        })}
      </DrawerContentScrollView>

      {/* ── Footer: Logged-in User ── */}
      <View className={`gap-3 border-t border-border py-4 ${isCollapsed ? 'px-4' : 'px-6'}`}>
        <View className={`flex-row items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Text className="text-base font-semibold text-background">{userInitial}</Text>
          </View>
          {!isCollapsed ? (
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                {userName}
              </Text>
              <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 36,
    height: 36,
  },
});
