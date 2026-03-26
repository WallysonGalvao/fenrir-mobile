import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Pressable, Text, View } from 'react-native';

import { Input, InputErrorText, InputField, InputSlot } from '@/components/input';
import { KeyboardDismissWrapper } from '@/components/keyboard-dismiss-wrapper';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

import { FormHeader } from '../shared/form-header';
import { PasswordToggle } from '../shared/password-toggle';
import { ServerError } from '../shared/server-error';
import { SubmitButton } from '../shared/submit-button';
import type { SignInSchemaType } from './schema';
import { signInSchema } from './schema';

export default function SignIn() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const [serverError, setServerError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const onBack = () => router.back();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({ resolver: zodResolver(signInSchema) });

  async function onSubmit({ email, password }: SignInSchemaType) {
    setServerError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setServerError(error.message);
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardDismissWrapper>
        <View className="w-full flex-1 self-center px-6 py-4 md:mt-20 md:max-w-110">
          <Animated.View
            entering={FadeInRight.duration(320)}
            exiting={FadeOutLeft.duration(220)}
            className="flex-1 gap-6"
          >
            <FormHeader onBack={onBack} backLabel={t('auth.backToLanding')} />

            <View className="gap-2">
              <Text className="text-[28px] font-extrabold tracking-tight text-foreground md:text-[42px] md:tracking-tighter md:text-primary dark:text-foreground-dark md:dark:text-primary-dark">
                {t('auth.signIn')}
              </Text>
              <Text className="hidden text-[17px] leading-6 text-foreground-secondary md:flex dark:text-foreground-secondary-dark">
                {t('auth.signInSubtitle')}
              </Text>
            </View>

            <ServerError message={serverError} />

            <View className="gap-2">
              <Text className="mb-0.5 text-[13px] font-medium text-foreground-secondary dark:text-foreground-secondary-dark">
                {t('auth.account')}
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1">
                    <Input isInvalid={!!errors.email}>
                      <InputSlot position="left">
                        <SymbolView
                          name={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }}
                          size={18}
                          tintColor={theme.textSecondary}
                        />
                      </InputSlot>
                      <InputField
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('auth.emailPlaceholder')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        accessibilityLabel={t('auth.email')}
                        accessibilityHint={t('auth.emailHint')}
                      />
                    </Input>
                    {errors.email ? <InputErrorText>{errors.email.message}</InputErrorText> : null}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1">
                    <Input isInvalid={!!errors.password}>
                      <InputSlot position="left">
                        <SymbolView
                          name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                          size={18}
                          tintColor={theme.textSecondary}
                        />
                      </InputSlot>
                      <InputField
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('auth.passwordPlaceholder')}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="current-password"
                        accessibilityLabel={t('auth.password')}
                        accessibilityHint={t('auth.passwordHint')}
                      />
                      <InputSlot position="right">
                        <PasswordToggle
                          visible={showPassword}
                          onToggle={() => setShowPassword((prev) => !prev)}
                        />
                      </InputSlot>
                    </Input>
                    {errors.password ? (
                      <InputErrorText>{errors.password.message}</InputErrorText>
                    ) : null}
                  </View>
                )}
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
          </Animated.View>
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}
