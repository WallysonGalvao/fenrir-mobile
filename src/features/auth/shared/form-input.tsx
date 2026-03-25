import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { Control, FieldErrors, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  errors: FieldErrors<T>;
  icon: SymbolViewProps['name'];
  placeholder: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  rightElement?: React.ReactNode;
} & Pick<
  TextInputProps,
  | 'keyboardType'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'secureTextEntry'
  | 'autoFocus'
>;

export function FormInput<T extends FieldValues>({
  control,
  name,
  errors,
  icon,
  placeholder,
  accessibilityLabel,
  accessibilityHint,
  rightElement,
  ...inputProps
}: FormInputProps<T>) {
  const theme = useTheme();
  const error = errors[name];

  return (
    <View className="gap-1">
      <View
        className={`flex-row items-center h-11 border rounded-[10px] px-4 gap-2 bg-background-element dark:bg-background-element-dark ${
          error ? 'border-error' : 'border-border dark:border-border-dark'
        }`}
      >
        <SymbolView name={icon} size={18} tintColor={theme.textSecondary} />
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 h-full text-[15px] text-foreground dark:text-foreground-dark"
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              accessibilityLabel={accessibilityLabel}
              accessibilityHint={accessibilityHint}
              {...inputProps}
            />
          )}
        />
        {rightElement}
      </View>
      {error ? <Text className="text-xs text-error pl-1">{error.message as string}</Text> : null}
    </View>
  );
}
