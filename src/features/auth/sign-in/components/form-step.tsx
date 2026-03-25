import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text } from 'react-native';

import { FormHeader } from '../../shared/form-header';

import { useSignIn } from '../context';
import { FormFields } from './form-fields';

export function FormStep() {
  const { t } = useTranslation();
  const { onBack } = useSignIn();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <FormHeader onBack={onBack} backLabel={t('auth.backToLanding')} />

      <Text className="text-[28px] font-extrabold tracking-tight text-foreground dark:text-foreground-dark">
        {t('auth.signIn')}
      </Text>

      <FormFields />
    </Animated.View>
  );
}
