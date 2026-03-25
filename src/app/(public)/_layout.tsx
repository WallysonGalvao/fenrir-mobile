import { Stack } from 'expo-router';

import { useSession } from '@/stores/auth';

export default function PublicLayout() {
  const { session, isPasswordRecovery } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="landing">
      <Stack.Protected guard={!session}>
        <Stack.Screen name="landing" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
      <Stack.Protected guard={!!isPasswordRecovery}>
        <Stack.Screen name="set-new-password" />
      </Stack.Protected>
    </Stack>
  );
}
