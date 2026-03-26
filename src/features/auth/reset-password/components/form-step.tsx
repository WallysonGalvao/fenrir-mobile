import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Text } from 'react-native';

import { FormHeader } from '../../shared/form-header';
import { EmailFormFields } from './email-form-fields';

type FormStepProps = {
  onBack: () => void;
  onSuccess: () => void;
};

export function FormStep({ onBack, onSuccess }: FormStepProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      className="flex-1 gap-6"
    >
      <FormHeader onBack={onBack} backLabel={t('auth.backToSignIn')} />

      <Text className="text-[28px] font-extrabold tracking-tight text-foreground">
        {t('auth.resetPassword')}
      </Text>

      <Text className="text-[15px] leading-6 text-foreground-secondary -mt-2">
        {t('auth.resetPasswordSubtitle')}
      </Text>

      <EmailFormFields onBack={onBack} onSuccess={onSuccess} />
    </Animated.View>
  );
}
