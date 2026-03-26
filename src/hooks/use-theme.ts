/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Appearance } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const colorScheme = useColorScheme();
  const scheme: 'light' | 'dark' =
    colorScheme === 'light' || colorScheme === 'dark'
      ? colorScheme
      : Appearance.getColorScheme() === 'dark'
        ? 'dark'
        : 'light';

  return Colors[scheme];
}
