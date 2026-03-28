import * as Linking from 'expo-linking'
import type { Action } from 'expo-quick-actions'
import { useQuickActionCallback } from 'expo-quick-actions/hooks'
import { useRouter } from 'expo-router'

export const useQuickActionRouting = () => {
  const router = useRouter()

  useQuickActionCallback((action: Action) => {
    const href = action.params?.href as string | undefined

    if (!href) {
      console.warn('[QuickActions] No href provided in action params', action)
      return
    }

    if (href.startsWith('mailto:')) {
      Linking.openURL(href).catch(error =>
        console.error('[QuickActions] Failed to open mailto:', error),
      )
      return
    }

    setTimeout(() => {
      try {
        // @ts-expect-error - Expo Router href type is too strict for dynamic strings
        router.push(href)
      } catch (error) {
        console.error('[QuickActions] Navigation error:', error)
      }
    }, 100)
  })
}
