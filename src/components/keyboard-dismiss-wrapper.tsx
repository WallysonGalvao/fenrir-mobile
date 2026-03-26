'use client'

import type { ReactNode } from 'react'

import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

type Props = {
  children: ReactNode
}

export function KeyboardDismissWrapper({ children }: Props) {
  if (Platform.OS === 'web') {
    return <View className="flex-1">{children}</View>
  }

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      className="flex-1"
    >
      <View className="flex-1">{children}</View>
    </TouchableWithoutFeedback>
  )
}
