import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Tooltip, TooltipContent, TooltipText } from '@/components/tooltip';
import { useTheme } from '@/hooks/use-theme';

type DrawerHeaderProps = {
  isCollapsed: boolean;
};

export function DrawerHeader({ isCollapsed }: DrawerHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useTheme();

  return (
    <View
      className={`flex-row items-center gap-3 px-4 py-4  ${
        isCollapsed ? 'justify-center' : 'justify-start'
      }`}
    >
      {isCollapsed ? (
        <Tooltip
          trigger={(triggerProps) => (
            <Pressable
              {...triggerProps}
              onPress={() => router.push('/')}
              accessibilityRole="link"
              className="flex-row items-center gap-3 p-2"
            >
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-background-element">
                <Image
                  source={require('@/assets/images/fenrir-logo.png')}
                  style={styles.image}
                  tintColor={colors.text}
                  contentFit="contain"
                  accessibilityIgnoresInvertColors
                />
              </View>
            </Pressable>
          )}
          placement="right"
        >
          <TooltipContent>
            <TooltipText>{t('auth.appName')}</TooltipText>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="link"
          className="flex-1 flex-row items-center gap-3 rounded-xl p-2 web:hover:bg-foreground/5"
        >
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-background-element">
            <Image
              source={require('@/assets/images/fenrir-logo.png')}
              style={styles.image}
              tintColor={colors.text}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
          </View>

          <View className="flex-1">
            <Text className="text-[11px] font-medium uppercase tracking-[2.5px] text-foreground-secondary">
              {t('drawer.eyebrow')}
            </Text>
            <Text className="text-xl font-semibold text-foreground">{t('auth.appName')}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
  },
});
