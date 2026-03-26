import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text, View } from 'react-native';

import { Button, ButtonText } from '@/components/button';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';

type SuccessLayoutProps = {
  icon: SymbolViewProps['name'];
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
};

export function SuccessLayout({
  icon,
  title,
  description,
  buttonLabel,
  onPress,
}: SuccessLayoutProps) {
  const theme = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="w-full flex-1 self-center px-6 py-4 md:mt-20 md:max-w-110">
        <Animated.View
          entering={FadeInRight.duration(320)}
          exiting={FadeOutLeft.duration(220)}
          className="flex-1 gap-6"
        >
          <View className="items-center gap-3">
            <SymbolView name={icon} size={48} tintColor={theme.primary} />
            <Text className="text-center text-[28px] font-extrabold tracking-tight text-foreground md:text-[42px] md:tracking-tighter">
              {title}
            </Text>
            <Text className="px-4 text-center text-[15px] leading-6 text-foreground-secondary md:text-[17px]">
              {description}
            </Text>
          </View>

          <Button onPress={onPress}>
            <ButtonText>{buttonLabel}</ButtonText>
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
