import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';

const isWeb = Platform.OS === 'web';

type SubmitButtonProps = {
  label: string;
  isSubmitting: boolean;
  onPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export function SubmitButton({
  label,
  isSubmitting,
  onPress,
  secondaryLabel,
  onSecondaryPress,
}: SubmitButtonProps) {
  if (isWeb) {
    return (
      <View className="flex-row justify-between items-center mt-2">
        {secondaryLabel && onSecondaryPress ? (
          <Pressable
            className="h-10.5 px-6 rounded-[21px] bg-button-secondary justify-center items-center active:opacity-60"
            onPress={onSecondaryPress}
            accessibilityRole="button"
          >
            <Text className="text-[15px] font-semibold text-foreground-secondary">
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : (
          <View />
        )}

        <Pressable
          className="h-10.5 px-8 bg-primary rounded-[21px] justify-center items-center active:opacity-75 disabled:opacity-75"
          onPress={onPress}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#EAF2FF" />
          ) : (
            <Text className="text-white text-[15px] font-semibold">{label}</Text>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      className="h-12 bg-primary rounded-3xl justify-center items-center mt-2 active:opacity-75 disabled:opacity-75"
      onPress={onPress}
      disabled={isSubmitting}
      accessibilityRole="button"
    >
      {isSubmitting ? (
        <ActivityIndicator color="#EAF2FF" />
      ) : (
        <Text className="text-white text-base font-semibold">{label}</Text>
      )}
    </Pressable>
  );
}
