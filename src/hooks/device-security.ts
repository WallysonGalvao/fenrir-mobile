import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';

import { Platform } from 'react-native';

interface DeviceIntegrityResult {
  isCompromised: boolean;
}

/**
 * Checks if the device is rooted (Android) or jailbroken (iOS).
 * Skipped in dev mode and on web to avoid blocking development.
 * Returns `isCompromised: false` on failure to avoid blocking legitimate users.
 */
export async function checkDeviceIntegrity(): Promise<DeviceIntegrityResult> {
  if (__DEV__ || Platform.OS === 'web') {
    return { isCompromised: false };
  }

  try {
    const isRooted = await Device.isRootedExperimentalAsync();

    if (isRooted) {
      Sentry.captureMessage('Compromised device detected', {
        level: 'warning',
        tags: {
          security: 'device_compromised',
          platform: Platform.OS,
          brand: Device.brand ?? 'unknown',
          modelName: Device.modelName ?? 'unknown',
        },
      });
    }

    return { isCompromised: isRooted };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { security: 'root_check_failed' },
    });
    return { isCompromised: false };
  }
}
