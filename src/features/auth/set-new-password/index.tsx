import React, { useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import type { TextInput } from 'react-native';
import { Keyboard, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { Button, ButtonText } from '@/components/button';
import { Header } from '@/components/header';
import { Input, InputErrorText, InputField, InputSlot } from '@/components/input';
import { KeyboardDismissWrapper } from '@/components/keyboard-dismiss-wrapper';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';

import { PasswordToggle } from '../shared/password-toggle';
import { useSetNewPassword } from './hooks/use-set-new-password';
import type { SetNewPasswordSchemaType } from './schema';
import { setNewPasswordSchema } from './schema';
import { SuccessStep } from './success-step';

type Step = 'form' | 'success';

export default function SetNewPassword() {
  const theme = useTheme();

  const { t } = useTranslation();
  const { setNewPassword } = useSetNewPassword();

  const [step, setStep] = useState<Step>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetNewPasswordSchemaType>({ resolver: zodResolver(setNewPasswordSchema) });

  async function onSubmit({ password }: SetNewPasswordSchemaType) {
    Keyboard.dismiss();
    await setNewPassword({ password, onSuccess: () => setStep('success') });
  }

  if (step === 'success') {
    return <SuccessStep />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header />
      <KeyboardDismissWrapper>
        <View className="w-full flex-1 self-center px-6 py-4 md:mt-20 md:max-w-110">
          <Animated.View
            entering={FadeInRight.duration(320)}
            exiting={FadeOutLeft.duration(220)}
            className="flex-1 gap-6"
          >
            <View className="gap-2">
              <Text className="text-[28px] font-extrabold tracking-tight text-foreground md:text-[42px] md:tracking-tighter md:text-primary">
                {t('auth.setNewPassword')}
              </Text>
              <Text className="text-[15px] leading-6 text-foreground-secondary">
                {t('auth.setNewPasswordSubtitle')}
              </Text>
            </View>

            <View className="gap-2">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1">
                    <Input isInvalid={!!errors.password}>
                      <InputSlot position="left">
                        {(focused) => (
                          <SymbolView
                            name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                            size={18}
                            tintColor={focused ? theme.primary : theme.textSecondary}
                          />
                        )}
                      </InputSlot>
                      <InputField
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('auth.newPasswordPlaceholder')}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        accessibilityLabel={t('auth.newPassword')}
                        accessibilityHint={t('auth.setNewPasswordSubtitle')}
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1">
                    <Input isInvalid={!!errors.confirmPassword}>
                      <InputSlot position="left">
                        {(focused) => (
                          <SymbolView
                            name={{
                              ios: 'lock.rotation',
                              android: 'lock_reset',
                              web: 'lock_reset',
                            }}
                            size={18}
                            tintColor={focused ? theme.primary : theme.textSecondary}
                          />
                        )}
                      </InputSlot>
                      <InputField
                        ref={confirmPasswordRef}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        accessibilityLabel={t('auth.confirmPassword')}
                        accessibilityHint={t('auth.confirmPasswordPlaceholder')}
                      />
                      <InputSlot position="right">
                        <PasswordToggle
                          visible={showConfirmPassword}
                          onToggle={() => setShowConfirmPassword((prev) => !prev)}
                        />
                      </InputSlot>
                    </Input>
                    {errors.confirmPassword ? (
                      <InputErrorText>{errors.confirmPassword.message}</InputErrorText>
                    ) : null}
                  </View>
                )}
              />
            </View>

            <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <ButtonText>{t('auth.setNewPassword')}</ButtonText>
              )}
            </Button>
          </Animated.View>
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}
