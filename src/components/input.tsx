import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { Appearance, Pressable, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';

type InputFocusContextType = {
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  inputRef: React.RefObject<TextInput | null>;
};

const InputFocusContext = createContext<InputFocusContextType>({
  focused: false,
  onFocus: () => {},
  onBlur: () => {},
  inputRef: { current: null },
});

export const inputStyle = tv({
  base: 'h-11 px-4 bg-background-element',
  variants: {
    variant: {
      outline: 'justify-center rounded-[10px] border border-border',
    },
    isInvalid: {
      true: 'border-error',
    },
    isFocused: {
      true: 'border-primary',
    },
  },
});

export const inputFieldStyle = tv({
  base: 'flex-1 text-foreground text-[15px] font-normal py-0 placeholder:text-foreground-secondary h-full ios:leading-0 web:cursor-text web:data-[disabled=true]:cursor-not-allowed web:focus:outline-none web:focus-visible:outline-2 web:focus-visible:outline-primary',
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
  base: 'text-xs font-normal text-foreground-secondary',
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
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const focusCtx = useMemo(
    () => ({
      focused,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      inputRef,
    }),
    [focused],
  );

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
    <InputFocusContext.Provider value={focusCtx}>
      <View
        ref={ref}
        {...props}
        className={inputStyle({
          variant,
          isInvalid: !focused && isInvalid,
          isFocused: focused,
          class: className,
        })}
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
    </InputFocusContext.Provider>
  );
});

type InputFieldProps = React.ComponentProps<typeof TextInput> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = forwardRef<React.ComponentRef<typeof TextInput>, InputFieldProps>(
  function InputField({ className, variant = 'outline', onFocus, onBlur, ...props }, ref) {
    const ctx = useContext(InputFocusContext);
    const scheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    const selectionColor = ctx.focused ? Colors[scheme].primary : Colors[scheme].textSecondary;

    const mergedRef = useCallback(
      (node: TextInput | null) => {
        ctx.inputRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ctx.inputRef, ref],
    );

    return (
      <TextInput
        ref={mergedRef}
        {...props}
        onFocus={(e) => {
          ctx.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          ctx.onBlur();
          onBlur?.(e);
        }}
        selectionColor={selectionColor}
        cursorColor={selectionColor}
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

type InputSlotProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> &
  VariantProps<typeof inputSlotStyle> & {
    className?: string;
    children: React.ReactNode | ((focused: boolean) => React.ReactNode);
  };

const InputSlot = forwardRef<React.ComponentRef<typeof Pressable>, InputSlotProps>(
  function InputSlot({ className, position = 'left', children, onPress, ...props }, ref) {
    const { focused, inputRef } = useContext(InputFocusContext);
    const content = typeof children === 'function' ? children(focused) : children;

    const handlePress = position === 'left' ? () => inputRef.current?.focus() : onPress;

    return (
      <Pressable
        ref={ref}
        {...props}
        onPress={handlePress}
        tabIndex={position === 'left' ? -1 : undefined}
        className={inputSlotStyle({ position, class: className })}
      >
        {content}
      </Pressable>
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
