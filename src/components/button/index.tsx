import { forwardRef } from 'react';

import { tv, type VariantProps } from 'tailwind-variants';

import { Platform, Pressable, Text } from 'react-native';

import { ButtonStyleProvider, useStyleContext } from './context';

export const buttonStyle = tv({
  base: 'group/button h-12 rounded-3xl flex-row items-center justify-center gap-2 active:opacity-75 disabled:opacity-75 data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2',
  variants: {
    action: {
      primary: 'bg-primary',
      secondary: 'bg-button-secondary active:opacity-60',
      disabled: 'bg-gray-200 dark:bg-gray-700',
    },
    variant: {
      solid: '',
      outline:
        'bg-transparent border border-light dark:border-gray-600 active:bg-light/80 dark:active:bg-gray-800/80',
    },
  },
  defaultVariants: {
    variant: 'solid',
    action: 'primary',
  },
});

export const buttonTextStyle = tv({
  base: 'text-base font-semibold web:select-none',
  variants: {
    action: {
      primary: 'text-white',
      secondary: 'text-foreground-secondary',
      disabled: 'text-gray-500 dark:text-gray-400',
    },
    variant: {
      solid: 'text-white',
      outline: 'text-primary dark:text-lighter active:opacity-70',
    },
  },
  defaultVariants: {
    variant: 'solid',
    action: 'primary',
  },
});

type IButtonProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonStyle> & { className?: string };

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, IButtonProps>(
  function Button({ className, variant = 'solid', action = 'primary', ...props }, ref) {
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
    );
  },
);

type IButtonTextProps = React.ComponentProps<typeof Text> & {
  className?: string;
};

export const ButtonText = forwardRef<React.ComponentRef<typeof Text>, IButtonTextProps>(
  function ButtonText({ className, ...props }, ref) {
    const { variant, action } = useStyleContext();

    return (
      <Text
        ref={ref}
        {...props}
        className={buttonTextStyle({ variant, action, class: className })}
        pointerEvents="none"
        disabled
      />
    );
  },
);

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
