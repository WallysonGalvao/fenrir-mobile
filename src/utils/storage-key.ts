import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const SECURE_KEY_NAME = 'fenrir_mmkv_key';

let cachedKey: string | null = null;

/**
 * Returns the MMKV encryption key, initializing it on first call.
 *
 * On the first run, generates a cryptographically random UUID, persists it in
 * the device Keychain/Keystore with AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY, and
 * caches it in memory. Subsequent calls return the cached value immediately.
 *
 * Also migrates keys previously stored with WHEN_UNLOCKED_THIS_DEVICE_ONLY by
 * always re-writing with the less restrictive accessibility setting.
 *
 * @throws When the Keychain is not accessible (e.g. device locked right after a
 *         reboot and the app launched in the background).
 */
export function getMMKVEncryptionKey(): string {
  if (cachedKey !== null) return cachedKey;

  let key = SecureStore.getItem(SECURE_KEY_NAME);

  if (!key) {
    key = Crypto.randomUUID();
  }

  // (Re)store with AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY so the key is readable
  // while the app runs in the background. This also migrates any key that was
  // previously written with the more restrictive WHEN_UNLOCKED_THIS_DEVICE_ONLY.
  SecureStore.setItem(SECURE_KEY_NAME, key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });

  cachedKey = key;
  return key;
}
