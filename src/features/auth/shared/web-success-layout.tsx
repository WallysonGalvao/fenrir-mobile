import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Pressable, Text, View } from 'react-native';

type WebSuccessLayoutProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
};

export function WebSuccessLayout({
  icon,
  title,
  description,
  buttonLabel,
  onPress,
}: WebSuccessLayoutProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      className="flex-1 bg-background-surface dark:bg-background-surface-dark"
    >
      <View className="absolute inset-0 border-8 border-primary-glow dark:border-primary-glow-dark" />

      <View className="flex-1 justify-center items-center px-16">
        <View className="max-w-100 w-full items-center gap-6">
          <SymbolView name={icon} size={56} tintColor="#6ccfd1" />
          <Text className="text-[42px] font-extrabold tracking-tighter text-primary dark:text-primary-dark text-center">
            {title}
          </Text>
          <Text className="text-[17px] leading-6 text-foreground-secondary dark:text-foreground-secondary-dark text-center">
            {description}
          </Text>

          <Pressable
            className="h-10.5 px-8 bg-primary dark:bg-primary-dark rounded-[21px] justify-center items-center active:opacity-75 mt-4"
            onPress={onPress}
            accessibilityRole="button"
          >
            <Text className="text-white text-[15px] font-semibold">{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
