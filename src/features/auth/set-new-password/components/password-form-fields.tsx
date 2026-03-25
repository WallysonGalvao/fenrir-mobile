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

import { useSetNewPassword } from '../context';

const isWeb = Platform.OS === 'web';

type PasswordFields = { password: string; confirmPassword: string };

export function PasswordFormFields() {
  const { t } = useTranslation();
  const { onSuccess } = useSetNewPassword();
  const theme = useTheme();
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
      {serverError ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          className="rounded-lg border border-error/30 bg-error/10 px-4 py-2"
        >
          <Text className="text-[13px] text-error">{serverError}</Text>
        </Animated.View>
      ) : null}

      <View className="gap-2">
        <Text className="text-[13px] font-medium mb-0.5 text-foreground-secondary dark:text-foreground-secondary-dark">
          {t('auth.newPassword')}
        </Text>

        {/* New password field */}
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
                  placeholder={t('auth.newPasswordPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  autoFocus
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  accessibilityLabel={t('auth.newPassword')}
                  accessibilityHint={t('auth.setNewPasswordSubtitle')}
                />
              )}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityLabel={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              accessibilityHint={t('auth.togglePasswordHint')}
            >
              <SymbolView
                name={
                  showPassword
                    ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                    : { ios: 'eye', android: 'visibility', web: 'visibility' }
                }
                size={18}
                tintColor={theme.textSecondary}
              />
            </Pressable>
          </View>
          {errors.password ? (
            <Text className="text-xs text-error pl-1">{errors.password.message}</Text>
          ) : null}
        </View>

        {/* Confirm password field */}
        <View className="gap-1">
          <View
            className={`flex-row items-center h-11 border rounded-[10px] px-4 gap-2 bg-background-element dark:bg-background-element-dark ${
              errors.confirmPassword ? 'border-error' : 'border-border dark:border-border-dark'
            }`}
          >
            <SymbolView
              name={{ ios: 'lock.rotation', android: 'lock_reset', web: 'lock_reset' }}
              size={18}
              tintColor={theme.textSecondary}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 h-full text-[15px] text-foreground dark:text-foreground-dark"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  accessibilityLabel={t('auth.confirmPassword')}
                  accessibilityHint={t('auth.confirmPasswordPlaceholder')}
                />
              )}
            />
            <Pressable
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              accessibilityLabel={
                showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')
              }
              accessibilityHint={t('auth.togglePasswordHint')}
            >
              <SymbolView
                name={
                  showConfirmPassword
                    ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                    : { ios: 'eye', android: 'visibility', web: 'visibility' }
                }
                size={18}
                tintColor={theme.textSecondary}
              />
            </Pressable>
          </View>
          {errors.confirmPassword ? (
            <Text className="text-xs text-error pl-1">{errors.confirmPassword.message}</Text>
          ) : null}
        </View>
      </View>

      {isWeb ? (
        <View className="flex-row justify-end items-center mt-2">
          <Pressable
            className="h-10.5 px-8 bg-primary dark:bg-primary-dark rounded-[21px] justify-center items-center active:opacity-75 disabled:opacity-75"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#EAF2FF" />
            ) : (
              <Text className="text-white text-[15px] font-semibold">
                {t('auth.setNewPassword')}
              </Text>
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
            <Text className="text-white text-base font-semibold">{t('auth.setNewPassword')}</Text>
          )}
        </Pressable>
      )}
    </>
  );
}
