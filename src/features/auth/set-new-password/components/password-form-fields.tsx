import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod/v4';

import { Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

import { FormInput } from '../../shared/form-input';
import { PasswordToggle } from '../../shared/password-toggle';
import { ServerError } from '../../shared/server-error';
import { SubmitButton } from '../../shared/submit-button';
import { useSetNewPassword } from '../context';

type PasswordFields = { password: string; confirmPassword: string };

export function PasswordFormFields() {
  const { t } = useTranslation();
  const { onSuccess } = useSetNewPassword();
  const [serverError, setServerError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const schema = React.useMemo(
    () =>
      z
        .object({
          password: z
            .string()
            .min(8, t('auth.passwordMinLength'))
            .regex(/[A-Z]/, t('auth.passwordUppercase'))
            .regex(/[a-z]/, t('auth.passwordLowercase'))
            .regex(/[0-9]/, t('auth.passwordNumber'))
            .regex(/[^A-Za-z0-9]/, t('auth.passwordSpecial')),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('auth.passwordsDoNotMatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFields>({ resolver: zodResolver(schema) });

  async function onSubmit({ password }: PasswordFields) {
    setServerError('');
    const { error } = await supabase.auth.updateUser({ password });
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
          {t('auth.newPassword')}
        </Text>

        <FormInput
          control={control}
          name="password"
          errors={errors}
          icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          placeholder={t('auth.newPasswordPlaceholder')}
          secureTextEntry={!showPassword}
          autoComplete="new-password"
          autoFocus
          accessibilityLabel={t('auth.newPassword')}
          accessibilityHint={t('auth.setNewPasswordSubtitle')}
          rightElement={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <FormInput
          control={control}
          name="confirmPassword"
          errors={errors}
          icon={{ ios: 'lock.rotation', android: 'lock_reset', web: 'lock_reset' }}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          secureTextEntry={!showConfirmPassword}
          autoComplete="new-password"
          accessibilityLabel={t('auth.confirmPassword')}
          accessibilityHint={t('auth.confirmPasswordPlaceholder')}
          rightElement={
            <PasswordToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          }
        />
      </View>

      <SubmitButton
        label={t('auth.setNewPassword')}
        isSubmitting={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
}
