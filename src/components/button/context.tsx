import { createContext, useContext } from 'react'

import type { VariantProps } from 'tailwind-variants'

import type { buttonStyle } from '.'

type ButtonContextType = {
  variant: VariantProps<typeof buttonStyle>['variant']
  action: VariantProps<typeof buttonStyle>['action']
}

const ButtonContext = createContext<ButtonContextType | null>(null)

export const ButtonStyleProvider = ButtonContext.Provider

export const useStyleContext = () => {
  const context = useContext(ButtonContext)
  if (!context) {
    throw new Error('useStyleContext must be used within an Button')
  }
  return context
}
