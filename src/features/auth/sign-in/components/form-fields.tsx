import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod/v4';

import { Pressable, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

import { FormInput } from '../../shared/form-input';
import { PasswordToggle } from '../../shared/password-toggle';
import { ServerError } from '../../shared/server-error';
import { SubmitButton } from '../../shared/submit-button';

type FormFieldsProps = {
  onBack: () => void;
};

type SignInFields = { email: string; password: string };

export function FormFields({ onBack }: FormFieldsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const schema = React.useMemo(
    () =>
      z.object({
        email: z.email(t('auth.emailInvalid')),
        password: z.string().min(1, t('auth.passwordMinLength')),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFields>({ resolver: zodResolver(schema) });

  async function onSubmit({ email, password }: SignInFields) {
    setServerError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setServerError(error.message);
  }

  return (
    <>
      <ServerError message={serverError} />

      <View className="gap-2">
        <Text className="text-[13px] font-medium mb-0.5 text-foreground-secondary dark:text-foreground-secondary-dark">
          {t('auth.account')}
        </Text>

        <FormInput
          control={control}
          name="email"
          errors={errors}
          icon={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoComplete="email"
          accessibilityLabel={t('auth.email')}
          accessibilityHint={t('auth.emailHint')}
        />

        <FormInput
          control={control}
          name="password"
          errors={errors}
          icon={{ ios: 'lock', android: 'lock', web: 'lock' }}
          placeholder={t('auth.passwordPlaceholder')}
          secureTextEntry={!showPassword}
          autoComplete="current-password"
          accessibilityLabel={t('auth.password')}
          accessibilityHint={t('auth.passwordHint')}
          rightElement={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <View className="flex-row justify-end">
          <Pressable onPress={() => router.push('/reset-password')} accessibilityRole="link">
            <Text className="text-[13px] font-medium text-primary dark:text-primary-dark">
              {t('auth.forgotPassword')}
            </Text>
          </Pressable>
        </View>
      </View>

      <SubmitButton
        label={t('auth.signIn')}
        isSubmitting={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        secondaryLabel={t('auth.backToLanding')}
        onSecondaryPress={onBack}
      />
    </>
  );
}
