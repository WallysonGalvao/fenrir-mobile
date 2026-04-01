import { Platform } from 'react-native';

/**
 * Hook to determine if the device is running iOS 26 or later
 * iOS 26+ corresponds to React Native 0.83+ and supports modern features like:
 * - Expo Router's native tabs API
 * - Advanced UI components
 * - Platform-specific optimizations
 *
 * @returns {boolean} True if device is iOS 26 or later
 */
export function useIsIOS26OrLater(): boolean {
  // Check if running on iOS 26+
  if (Platform.OS === 'ios') {
    const iosVersion = parseInt(Platform.Version as string, 10);
    return iosVersion >= 26;
  }

  // Android and other platforms return false
  return false;
}
