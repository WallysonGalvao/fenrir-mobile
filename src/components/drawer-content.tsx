import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Image } from 'expo-image';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSession } from '@/stores/auth';

export function DrawerContent(props: DrawerContentComponentProps) {
  const session = useSession((s) => s.session);

  const userEmail = session?.user?.email ?? '';
  const userName = session?.user?.user_metadata?.full_name ?? userEmail.split('@')[0] ?? '';

  return (
    <View className="flex-1 bg-background">
      {/* ── Header: Logo + App Name ── */}
      <View className="flex-row items-center gap-3 px-6 pt-16 pb-6">
        <Image
          source={require('@/assets/images/fenrir-logo.png')}
          style={styles.image}
          className="h-9 w-9"
          tintColor="var(--color-foreground)"
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
        <Text className="text-xl font-semibold text-foreground">Fenrir</Text>
      </View>

      {/* ── Drawer Items ── */}
      <DrawerContentScrollView {...props} contentContainerClassName="px-3 py-2">
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key];
          const label = options.drawerLabel ?? options.title ?? route.name;
          const isFocused = props.state.index === index;

          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name)}
              className={`mb-1 rounded-lg px-4 py-3 ${isFocused ? 'bg-background-element' : ''} active:opacity-70`}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
            >
              <Text
                className={`text-base font-medium ${isFocused ? 'text-foreground' : 'text-foreground-secondary'}`}
              >
                {typeof label === 'string' ? label : route.name}
              </Text>
            </Pressable>
          );
        })}
      </DrawerContentScrollView>

      {/* ── Footer: Logged-in User ── */}
      <View className="gap-3 border-t border-border px-6 py-4">
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Text className="text-base font-semibold text-background">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
              {userName}
            </Text>
            <Text className="text-xs text-foreground-secondary" numberOfLines={1}>
              {userEmail}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 36,
    height: 36,
  },
});
