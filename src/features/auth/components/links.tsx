import { useCallback } from 'react'

import { Linking, Text } from 'react-native'
import type { TextProps } from 'react-native'

import { URLS } from '@/constants/urls'

type LinkTextProps = React.PropsWithChildren<TextProps>

const LinkText = ({ children, ...rest }: LinkTextProps) => (
  <Text
    className="font-semibold text-sm text-primary underline"
    suppressHighlighting
    {...rest}
  >
    {children}
  </Text>
)

export const TermsLink = (props: TextProps) => {
  const onPress = useCallback(
    () => Linking.openURL(URLS.TERMS_AND_CONDITIONS),
    [],
  )

  return <LinkText {...props} onPress={onPress} />
}

export const PrivacyLink = (props: TextProps) => {
  const onPress = useCallback(() => Linking.openURL(URLS.PRIVACY_POLICY), [])

  return <LinkText {...props} onPress={onPress} />
}
