import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type FormHeaderProps = {
  onBack?: () => void;
  backLabel?: string;
};

export function FormHeader({ onBack, backLabel }: FormHeaderProps) {
  const theme = useTheme();
  const scheme = useColorScheme();

  return (
    <View className="flex-row items-center justify-between">
      {onBack ? (
        <Pressable
          className="w-10 h-10 justify-center items-center active:opacity-60"
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
        >
          <SymbolView
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            size={22}
            tintColor={theme.text}
          />
        </Pressable>
      ) : (
        <View className="w-10 h-10" />
      )}
      <View className="items-center">
        <Image
          source={require('@/assets/images/fenrir-logo.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityIgnoresInvertColors
          tintColor={scheme === 'dark' ? 'white' : 'black'}
        />
      </View>
      <View className="w-10 h-10" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 32,
    height: 32,
  },
});
