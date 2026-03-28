import { Stack } from 'expo-router';

import { ProtectedPageShell } from '@/components/protected-page-shell';

export default function DrawerGroupWebLayout() {
  return (
    <ProtectedPageShell>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="[slug]" />
      </Stack>
    </ProtectedPageShell>
  );
}
