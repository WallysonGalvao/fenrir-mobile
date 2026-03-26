import { forwardRef } from 'react'

import { tv, type VariantProps } from 'tailwind-variants'

import { Platform, Pressable, Text } from 'react-native'

import { ButtonStyleProvider, useStyleContext } from './context'

export const buttonStyle = tv({
  base: 'group/button h-14 rounded bg-primary dark:bg-primary flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2',
  variants: {
    action: {
      primary:
        'active:bg-primary/80 bg-primary dark:bg-primary data-[hover=true]:bg-primary-600 dark:data-[hover=true]:bg-primary-400 data-[active=true]:bg-primary-700 dark:data-[active=true]:bg-primary-500 border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info',
      disabled:
        'bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-600 data-[hover=true]:bg-gray-600 dark:data-[hover=true]:bg-gray-600 data-[hover=true]:border-gray-400 dark:data-[hover=true]:border-gray-500 data-[active=true]:bg-gray-700 dark:data-[active=true]:bg-gray-800 data-[active=true]:border-gray-700 dark:data-[active=true]:border-gray-700 data-[focus-visible=true]:web:ring-indicator-info',
    },
    variant: {
      solid: '',
      outline:
        'active:bg-light/80 dark:active:bg-gray-800/80 bg-transparent border border-light dark:border-gray-600 data-[hover=true]:bg-light-50 dark:data-[hover=true]:bg-gray-800/50 data-[active=true]:bg-transparent dark:data-[active=true]:bg-gray-800/30',
    },
  },
  defaultVariants: {
    variant: 'solid',
    action: 'primary',
  },
})

export const buttonTextStyle = tv({
  base: 'font-semibold web:select-none',
  variants: {
    action: {
      primary: 'text-white dark:text-white',
      disabled: 'text-gray-500 dark:text-gray-400',
    },
    variant: {
      solid:
        'text-white dark:text-white data-[hover=true]:text-white dark:data-[hover=true]:text-white data-[active=true]:text-white dark:data-[active=true]:text-white active:opacity-70 data-[pressed=true]:opacity-70',
      outline:
        'text-primary dark:text-lighter data-[hover=true]:text-primary dark:data-[hover=true]:text-primary data-[active=true]:text-primary dark:data-[active=true]:text-primary active:opacity-70',
    },
  },
  defaultVariants: {
    variant: 'solid',
    action: 'primary',
  },
})

type IButtonProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonStyle> & { className?: string }

export const Button = forwardRef<
  React.ComponentRef<typeof Pressable>,
  IButtonProps
>(function Button(
  { className, variant = 'solid', action = 'primary', ...props },
  ref,
) {
  return (
    <ButtonStyleProvider value={{ variant, action }}>
      <Pressable
        ref={ref}
        {...props}
        accessible
        accessibilityRole="button"
        className={buttonStyle({ variant, action, class: className })}
        android_ripple={
          Platform.OS === 'android'
            ? { color: 'rgba(255, 255, 255, 0.2)', borderless: false }
            : undefined
        }
      />
    </ButtonStyleProvider>
  )
})

type IButtonTextProps = React.ComponentProps<typeof Text> & {
  className?: string
}

export const ButtonText = forwardRef<
  React.ComponentRef<typeof Text>,
  IButtonTextProps
>(function ButtonText({ className, ...props }, ref) {
  const { variant, action } = useStyleContext()

  return (
    <Text
      ref={ref}
      {...props}
      className={buttonTextStyle({ variant, action, class: className })}
      pointerEvents="none"
      disabled
    />
  )
})

Button.displayName = 'Button'
ButtonText.displayName = 'ButtonText'
