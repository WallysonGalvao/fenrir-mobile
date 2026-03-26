import React, { useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import type { TextInput } from 'react-native';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { ActivityIndicator } from '@/components/activity-indicator';
import { Button, ButtonText } from '@/components/button';
import { Header, type IconButton } from '@/components/header';
import { Input, InputErrorText, InputField, InputSlot } from '@/components/input';
import { KeyboardDismissWrapper } from '@/components/keyboard-dismiss-wrapper';
import { SafeAreaView } from '@/components/safe-area-view';
import { useTheme } from '@/hooks/use-theme';

import { PrivacyLink, TermsLink } from '../components/links';
import { PasswordToggle } from '../components/password-toggle';
import { useSignIn } from './hooks/use-sign-in';
import type { SignInSchemaType } from './schema';
import { signInSchema } from './schema';

export default function SignIn() {
  const router = useRouter();
  const theme = useTheme();

  const { t } = useTranslation();
  const { signIn } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({ resolver: zodResolver(signInSchema) });

  const leftIcons: IconButton = {
    icon: (
      <SymbolView
        name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
        size={22}
        tintColor={theme.text}
      />
    ),
    onPress: () => router.back(),
    accessibilityLabel: t('auth.backToLanding'),
    accessibilityHint: t('auth.backToLanding'),
  };

  async function onSubmit({ email, password }: SignInSchemaType) {
    Keyboard.dismiss();
    await signIn({ email, password });
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
                {t('auth.signIn')}
              </Text>
              <Text className="hidden text-[17px] leading-6 text-foreground-secondary md:flex">
                {t('auth.signInSubtitle')}
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
                            name={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }}
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
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
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
                        {(focused) => (
                          <SymbolView
                            name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                            size={18}
                            tintColor={focused ? theme.primary : theme.textSecondary}
                          />
                        )}
                      </InputSlot>
                      <InputField
                        ref={passwordRef}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t('auth.passwordPlaceholder')}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="current-password"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
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
                  <Text className="text-[13px] font-medium text-primary">
                    {t('auth.forgotPassword')}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator /> : <ButtonText>{t('auth.signIn')}</ButtonText>}
            </Button>

            <Text
              className="font-base text-left text-sm text-gray-600 web:text-center dark:text-gray-400"
              accessible
              accessibilityRole="text"
            >
              <Trans
                i18nKey="auth.agreeTerms"
                components={{
                  1: <TermsLink />,
                  2: <PrivacyLink />,
                }}
              />
            </Text>
          </Animated.View>
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}
