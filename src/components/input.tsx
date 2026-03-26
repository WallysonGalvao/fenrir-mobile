import { Children, cloneElement, forwardRef, isValidElement } from 'react';

import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { Pressable, Text, TextInput, View } from 'react-native';

export const inputStyle = tv({
  base: 'h-11 px-4 bg-background-element dark:bg-background-element-dark',
  variants: {
    variant: {
      outline: 'justify-center rounded-[10px] border border-border dark:border-border-dark',
    },
    isInvalid: {
      true: 'border-error',
    },
  },
});

export const inputFieldStyle = tv({
  base: 'flex-1 text-foreground dark:text-foreground-dark text-[15px] font-normal py-0 placeholder:text-foreground-secondary dark:placeholder:text-foreground-secondary-dark h-full ios:leading-0 web:cursor-text web:data-[disabled=true]:cursor-not-allowed web:focus:outline-none web:focus-visible:outline-2 web:focus-visible:outline-primary',
  variants: {
    variant: {
      outline: 'web:outline-0 web:outline-none',
    },
  },
});

export const inputLabelStyle = tv({
  base: 'flex flex-row justify-start items-center mt-1',
});

export const inputLabelTextStyle = tv({
  base: 'text-xs font-normal text-foreground-secondary dark:text-foreground-secondary-dark',
});

export const inputSlotStyle = tv({
  base: 'justify-center items-center web:disabled:cursor-not-allowed web:transition-opacity web:hover:opacity-80 web:focus-visible:outline-2 web:focus-visible:outline-primary web:rounded-md',
  variants: {
    position: {
      left: 'mr-3',
      right: 'mr-3',
    },
  },
});

export const inputErrorTextStyle = tv({
  base: 'text-xs font-normal text-error pl-1 mt-1',
});

type InputProps = React.ComponentProps<typeof View> &
  VariantProps<typeof inputStyle> & {
    className?: string;
    children: React.ReactNode;
    isInvalid?: boolean;
  };

const Input = forwardRef<React.ComponentRef<typeof View>, InputProps>(function Input(
  { className, variant = 'outline', isInvalid, children, ...props },
  ref,
) {
  const leftSlots: React.ReactNode[] = [];
  const rightSlots: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === InputSlot) {
      const slotElement = child as React.ReactElement<React.ComponentProps<typeof InputSlot>>;
      const position = slotElement.props.position ?? 'left';

      if (position === 'left') {
        leftSlots.push(child);
      } else {
        rightSlots.push(child);
      }
    } else {
      content.push(child);
    }
  });

  return (
    <View
      ref={ref}
      {...props}
      className={inputStyle({ variant, isInvalid, class: className })}
      accessible
      accessibilityRole="none"
    >
      <View className="h-full w-full flex-row items-center gap-2">
        {leftSlots.map((slot, idx) =>
          isValidElement(slot) ? cloneElement(slot, { key: `left-${idx}` }) : null,
        )}
        <View className="flex-1">{content}</View>
        {rightSlots.map((slot, idx) =>
          isValidElement(slot) ? cloneElement(slot, { key: `right-${idx}` }) : null,
        )}
      </View>
    </View>
  );
});

type InputFieldProps = React.ComponentProps<typeof TextInput> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = forwardRef<React.ComponentRef<typeof TextInput>, InputFieldProps>(
  function InputField({ className, variant = 'outline', ...props }, ref) {
    return (
      <TextInput
        ref={ref}
        {...props}
        className={inputFieldStyle({ variant, class: className })}
        accessible
        accessibilityRole="text"
      />
    );
  },
);

type InputLabelProps = React.ComponentProps<typeof View> & {
  className?: string;
};

const InputLabel = forwardRef<React.ComponentRef<typeof View>, InputLabelProps>(function InputLabel(
  { className, ...props },
  ref,
) {
  return <View ref={ref} {...props} className={inputLabelStyle({ class: className })} />;
});

type InputLabelTextProps = React.ComponentProps<typeof Text> & {
  className?: string;
};

const InputLabelText = forwardRef<React.ComponentRef<typeof Text>, InputLabelTextProps>(
  function InputLabelText({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        className={inputLabelTextStyle({ class: className })}
        accessible
        accessibilityRole="text"
        {...props}
      />
    );
  },
);

type InputSlotProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = forwardRef<React.ComponentRef<typeof Pressable>, InputSlotProps>(
  function InputSlot({ className, position = 'left', ...props }, ref) {
    return (
      <Pressable ref={ref} {...props} className={inputSlotStyle({ position, class: className })} />
    );
  },
);

type InputErrorTextProps = React.ComponentProps<typeof Text> & {
  className?: string;
};

const InputErrorText = forwardRef<React.ComponentRef<typeof Text>, InputErrorTextProps>(
  function InputErrorText({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        className={inputErrorTextStyle({ class: className })}
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
InputField.displayName = 'InputField';
InputLabel.displayName = 'InputLabel';
InputLabelText.displayName = 'InputLabelText';
InputSlot.displayName = 'InputSlot';
InputErrorText.displayName = 'InputErrorText';

export { Input, InputErrorText, InputField, InputLabel, InputLabelText, InputSlot };
