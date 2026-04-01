import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import { Keyboard, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { Button, ButtonText } from '@/components/button';
import { Header, type IconButton } from '@/components/header';
import { Input, InputErrorText, InputField, InputSlot } from '@/components/input';
import { KeyboardDismissWrapper } from '@/components/keyboard-dismiss-wrapper';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';

import { useResetPassword } from './hooks/use-reset-password';
import type { ResetPasswordSchemaType } from './schema';
import { resetPasswordSchema } from './schema';
import { SuccessStep } from './success-step';

type Step = 'form' | 'success';

export default function ResetPassword() {
  const router = useRouter();
  const theme = useTheme();

  const { t } = useTranslation();
  const { resetPassword } = useResetPassword();

  const [step, setStep] = useState<Step>('form');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const leftIcons: IconButton = {
    icon: (
      <SymbolView
        name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        size={22}
        tintColor={theme.text}
      />
    ),
    onPress: () => router.back(),
    accessibilityLabel: t('auth.backToSignIn'),
    accessibilityHint: t('auth.backToSignIn'),
  };

  async function onSubmit({ email }: ResetPasswordSchemaType) {
    Keyboard.dismiss();
    await resetPassword({ email, onSuccess: () => setStep('success') });
  }

  if (step === 'success') {
    return <SuccessStep />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header leftIcons={[leftIcons]} />
      <KeyboardDismissWrapper>
        <View className="w-full flex-1 self-center px-6 py-4 md:mt-20 md:max-w-110">
          <Animated.View
            entering={FadeInRight.duration(320)}
            exiting={FadeOutLeft.duration(220)}
            className="flex-1 gap-6"
          >
            <View className="gap-2">
              <Text className="text-[28px] font-extrabold tracking-tight text-foreground md:text-[42px] md:tracking-tighter md:text-primary">
                {t('auth.resetPassword')}
              </Text>
              <Text className="text-[15px] leading-6 text-foreground-secondary">
                {t('auth.resetPasswordSubtitle')}
              </Text>
            </View>

            <View className="gap-2">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="gap-1">
                    <Input isInvalid={!!errors.email}>
                      <InputSlot position="left">
                        {(focused) => (
                          <SymbolView
                            name={{
                              ios: 'at',
                              android: 'alternate_email',
                              web: 'alternate_email',
                            }}
                            size={18}
                            tintColor={focused ? theme.primary : theme.textSecondary}
                          />
                        )}
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
                        textContentType="username"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        accessibilityLabel={t('auth.email')}
                        accessibilityHint={t('auth.emailHint')}
                      />
                    </Input>
                    {errors.email ? <InputErrorText>{errors.email.message}</InputErrorText> : null}
                  </View>
                )}
              />
            </View>

            <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <ButtonText>{t('auth.sendResetLink')}</ButtonText>
              )}
            </Button>
          </Animated.View>
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}
