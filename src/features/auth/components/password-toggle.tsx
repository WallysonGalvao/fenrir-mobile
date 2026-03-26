import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';

import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type PasswordToggleProps = {
  visible: boolean;
  onToggle: () => void;
};

export function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityLabel={visible ? t('auth.hidePassword') : t('auth.showPassword')}
      accessibilityHint={t('auth.togglePasswordHint')}
    >
      <SymbolView
        name={
          visible
            ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
            : { ios: 'eye', android: 'visibility', web: 'visibility' }
        }
        size={18}
        tintColor={theme.textSecondary}
      />
    </Pressable>
  );
}
