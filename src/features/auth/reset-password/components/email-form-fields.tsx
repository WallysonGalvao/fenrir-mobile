import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod/v4';

import { Platform, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

import { FormInput } from '../../shared/form-input';
import { ServerError } from '../../shared/server-error';
import { SubmitButton } from '../../shared/submit-button';
import { useResetPassword } from '../context';

const isWeb = Platform.OS === 'web';

type ResetFields = { email: string };

export function EmailFormFields() {
  const { t } = useTranslation();
  const { onBack, onSuccess } = useResetPassword();
  const [serverError, setServerError] = React.useState('');

  const schema = React.useMemo(
    () =>
      z.object({
        email: z.email(t('auth.emailInvalid')),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFields>({ resolver: zodResolver(schema) });

  async function onSubmit({ email }: ResetFields) {
    setServerError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: isWeb
        ? `${window.location.origin}/set-new-password`
        : 'fenrir://set-new-password',
    });
    if (error) {
      setServerError(error.message);
    } else {
      onSuccess();
    }
  }

  return (
    <>
      <ServerError message={serverError} />

      <View className="gap-2">
        <Text className="text-[13px] font-medium mb-0.5 text-foreground-secondary dark:text-foreground-secondary-dark">
          {t('auth.email')}
        </Text>

        <FormInput
          control={control}
          name="email"
          errors={errors}
          icon={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoComplete="email"
          autoFocus
          accessibilityLabel={t('auth.email')}
          accessibilityHint={t('auth.emailHint')}
        />
      </View>

      <SubmitButton
        label={t('auth.sendResetLink')}
        isSubmitting={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        secondaryLabel={t('auth.backToSignIn')}
        onSecondaryPress={onBack}
      />
    </>
  );
}
