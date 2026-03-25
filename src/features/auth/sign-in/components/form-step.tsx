import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text } from 'react-native';

import { FormHeader } from '../../shared/form-header';
import { FormFields } from './form-fields';

type FormStepProps = {
  onBack: () => void;
};

export function FormStep({ onBack }: FormStepProps) {
  const { t } = useTranslation();

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

      <FormFields onBack={onBack} />
    </Animated.View>
  );
}
