import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const SECURE_KEY_NAME = 'fenrir_mmkv_key';

let cachedKey: string | null = null;

/**
 * Returns the MMKV encryption key synchronously.
 * Must only be called after `initMMKVEncryptionKey()` has resolved.
 *
 * Throws if called before initialization — this is a programming error and
 * means a store was accessed before the security init sequence completed.
 */
export function getMMKVEncryptionKey(): string {
  if (cachedKey === null) {
    throw new Error(
      '[Security] MMKV encryption key not initialized. ' +
        'Ensure initMMKVEncryptionKey() has resolved before accessing any store.',
    );
  }
  return cachedKey;
}

/**
 * Initializes the MMKV encryption key from the device Keychain/Keystore.
 *
 * On the first run:
 *   1. Generates a cryptographically random UUID as the encryption key.
 *   2. Stores it in the device Keychain/Keystore using AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
 *      so the key is accessible even when the app runs in the background.
 *
 * On subsequent runs:
 *   - Reads the key from the Keychain/Keystore and re-stores it with
 *     AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY to migrate keys that were previously
 *     stored with WHEN_UNLOCKED_THIS_DEVICE_ONLY.
 *
 * Must be called and awaited before any Zustand store is rehydrated.
 *
 * @throws When the Keychain is not accessible (e.g. device locked right after a
 *         reboot and the app was launched in the background). The caller should
 *         handle this gracefully and fall back to unencrypted or deferred state.
 */
export async function initMMKVEncryptionKey(): Promise<void> {
  let key: string | null = null;

  try {
    key = await SecureStore.getItemAsync(SECURE_KEY_NAME);
  } catch (error) {
    // This happens when the app is launched in the background while the device
    // is locked (e.g. right after a reboot). The Keychain item stored with
    // WHEN_UNLOCKED_THIS_DEVICE_ONLY is inaccessible until the user unlocks.
    // Re-throw so the caller can fall back gracefully without crashing.
    throw new Error(`[Security] Keychain inaccessible — device may be locked. Original: ${error}`);
  }

  if (!key) {
    key = Crypto.randomUUID();
  }

  // (Re)store with AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY so the key is readable
  // while the app runs in the background. This also migrates any key that was
  // previously written with the more restrictive WHEN_UNLOCKED_THIS_DEVICE_ONLY.
  await SecureStore.setItemAsync(SECURE_KEY_NAME, key, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });

  cachedKey = key;
}
