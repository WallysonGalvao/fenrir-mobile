import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';

import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Drawer screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="(drawer)" options={{ drawerLabel: 'Home', title: 'Home' }} />
      </Drawer>
    </ThemeProvider>
  );
}
