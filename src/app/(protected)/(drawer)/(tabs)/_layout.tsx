import { Slot } from 'expo-router';

import { Platform } from 'react-native';

import AppTabs from '@/components/app-tabs';

export default function TabsLayout() {
  return Platform.OS === 'web' ? <Slot /> : <AppTabs />;
}
