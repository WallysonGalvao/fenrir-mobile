import type { KeychainAccessibilityConstant } from 'expo-secure-store'

const store: Record<string, string> = {}

export const getItemAsync = jest.fn(async (key: string) => store[key] ?? null)

export const setItemAsync = jest.fn(
  async (key: string, value: string, _options?: unknown) => {
    store[key] = value
  },
)

export const deleteItemAsync = jest.fn(async (key: string) => {
  delete store[key]
})

export const WHEN_UNLOCKED_THIS_DEVICE_ONLY: KeychainAccessibilityConstant = 1
