import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from 'react-native';

type ServerErrorProps = {
  message: string;
};

export function ServerError({ message }: ServerErrorProps) {
  if (!message) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      className="rounded-lg border border-error/30 bg-error/10 px-4 py-2"
    >
      <Text className="text-[13px] text-error">{message}</Text>
    </Animated.View>
  );
}
