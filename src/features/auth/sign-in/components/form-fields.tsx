import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { z } from 'zod/v4';

import { ActivityIndicator, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

import { useSignIn } from '../context';

const isWeb = Platform.OS === 'web';

type SignInFields = { email: string; password: string };

export function FormFields() {
  const { t } = useTranslation();
  const { onBack } = useSignIn();
  const theme = useTheme();
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
      {serverError ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          className="rounded-lg border border-error/30 bg-error/10 px-4 py-2"
        >
          <Text className="text-[13px] text-error">{serverError}</Text>
        </Animated.View>
      ) : null}

      <View className="gap-2">
        {/* Account section label */}
        <Text className="text-[13px] font-medium mb-0.5 text-foreground-secondary dark:text-foreground-secondary-dark">
          {t('auth.account')}
        </Text>

        {/* Email field with @ icon */}
        <View className="gap-1">
          <View
            className={`flex-row items-center h-11 border rounded-[10px] px-4 gap-2 bg-background-element dark:bg-background-element-dark ${
              errors.email ? 'border-error' : 'border-border dark:border-border-dark'
            }`}
          >
            <SymbolView
              name={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }}
              size={18}
              tintColor={theme.textSecondary}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 h-full text-[15px] text-foreground dark:text-foreground-dark"
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  accessibilityLabel={t('auth.email')}
                  accessibilityHint={t('auth.emailHint')}
                />
              )}
            />
          </View>
          {errors.email ? (
            <Text className="text-xs text-error pl-1">{errors.email.message}</Text>
          ) : null}
        </View>

        {/* Password field with lock icon + Forgot? */}
        <View className="gap-1">
          <View
            className={`flex-row items-center h-11 border rounded-[10px] px-4 gap-2 bg-background-element dark:bg-background-element-dark ${
              errors.password ? 'border-error' : 'border-border dark:border-border-dark'
            }`}
          >
            <SymbolView
              name={{ ios: 'lock', android: 'lock', web: 'lock' }}
              size={18}
              tintColor={theme.textSecondary}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 h-full text-[15px] text-foreground dark:text-foreground-dark"
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  accessibilityLabel={t('auth.password')}
                  accessibilityHint={t('auth.passwordHint')}
                />
              )}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityLabel={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              accessibilityHint={t('auth.togglePasswordHint')}
            >
              <Text className="text-[13px] font-medium text-foreground-secondary dark:text-foreground-secondary-dark">
                {t('auth.forgotPassword')}
              </Text>
            </Pressable>
          </View>
          {errors.password ? (
            <Text className="text-xs text-error pl-1">{errors.password.message}</Text>
          ) : null}
        </View>
      </View>

      {/* Submit — different layout on web vs mobile */}
      {isWeb ? (
        <View className="flex-row justify-between items-center mt-2">
          <Pressable
            className="h-10.5 px-6 rounded-[21px] bg-button-secondary dark:bg-button-secondary-dark justify-center items-center active:opacity-60"
            onPress={onBack}
            accessibilityRole="button"
          >
            <Text className="text-[15px] font-semibold text-foreground-secondary dark:text-foreground-secondary-dark">
              {t('auth.backToLanding')}
            </Text>
          </Pressable>

          <Pressable
            className="h-10.5 px-8 bg-primary dark:bg-primary-dark rounded-[21px] justify-center items-center active:opacity-75 disabled:opacity-75"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#EAF2FF" />
            ) : (
              <Text className="text-white text-[15px] font-semibold">{t('auth.signIn')}</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <Pressable
          className="h-12 bg-primary dark:bg-primary-dark rounded-3xl justify-center items-center mt-2 active:opacity-75 disabled:opacity-75"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#EAF2FF" />
          ) : (
            <Text className="text-white text-base font-semibold">{t('auth.signIn')}</Text>
          )}
        </Pressable>
      )}
    </>
  );
}
