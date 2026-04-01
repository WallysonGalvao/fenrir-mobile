import { Stack } from 'expo-router';

import { WebShell } from '@/components/layout/web-shell';

export default function DrawerGroupWebLayout() {
  return (
    <WebShell>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="[slug]" />
      </Stack>
    </WebShell>
  );
}
