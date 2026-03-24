import '../config';

import React, { useEffect, useSyncExternalStore } from 'react';

import * as Sentry from '@sentry/react-native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { I18nextProvider } from 'react-i18next';

import { Platform } from 'react-native';

import { useRozeniteDevTools } from '@/hooks/use-rozenite-dev-tools';
import i18n from '@/i18n';
import { initAuth } from '@/services/auth';
import { useSession } from '@/stores/auth';
import { initMMKVEncryptionKey } from '@/utils/storage-key';

let storageReady = Platform.OS === 'web';
const storageListeners = new Set<() => void>();

if (!storageReady) {
  void (async () => {
    try {
      await initMMKVEncryptionKey();
    } finally {
      storageReady = true;
      storageListeners.forEach((l) => l());
    }
  })();
}

function subscribeStorageReady(listener: () => void) {
  storageListeners.add(listener);
  return () => {
    storageListeners.delete(listener);
  };
}

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useRozeniteDevTools(navigationRef);

  const isStorageReady = useSyncExternalStore(
    subscribeStorageReady,
    () => storageReady,
    () => false,
  );

  useEffect(() => initAuth(), []);

  if (!isStorageReady) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <RootNavigator />
    </I18nextProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
