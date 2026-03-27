import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type DrawerHeaderProps = {
  isCollapsed: boolean;
};

export function DrawerHeader({ isCollapsed }: DrawerHeaderProps) {
  const { t } = useTranslation();
  const colors = useTheme();

  return (
    <View
      className={`flex-row items-center gap-3 px-4 py-4 ${
        isCollapsed ? 'justify-center' : 'justify-start'
      }`}
    >
      <View className={`flex-row items-center gap-3 ${isCollapsed ? '' : 'flex-1'}`}>
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-background-element">
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.image}
            tintColor={colors.text}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </View>

        {!isCollapsed ? (
          <View className="flex-1">
            <Text className="text-[11px] font-medium uppercase tracking-[2.5px] text-foreground-secondary">
              {t('drawer.eyebrow')}
            </Text>
            <Text className="text-xl font-semibold text-foreground">{t('auth.appName')}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
  },
});
