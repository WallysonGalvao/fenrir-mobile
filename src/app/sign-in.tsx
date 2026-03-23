import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { type Href, Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod/v4';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

const ERROR_COLOR = '#ef4444';
const ERROR_BG = 'rgba(239, 68, 68, 0.1)';
const ERROR_BORDER = 'rgba(239, 68, 68, 0.3)';
const PRIMARY_COLOR = '#208AEF';
const WHITE = '#ffffff';

type SignInFields = { email: string; password: string };

export default function SignIn() {
  const { t } = useTranslation();
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
    // Stack.Protected redirects automatically after session updates
  }

  const emailBorderColor = errors.email ? ERROR_COLOR : theme.backgroundSelected;
  const passwordBorderColor = errors.password ? ERROR_COLOR : theme.backgroundSelected;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { shadowColor: theme.text }]}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.logoImage}
                contentFit="contain"
                accessibilityIgnoresInvertColors
              />
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>{t('auth.appName')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {t('auth.signInSubtitle')}
            </Text>
          </View>

          {serverError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>{t('auth.email')}</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        backgroundColor: theme.backgroundElement,
                        borderColor: emailBorderColor,
                      },
                    ]}
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
                    accessibilityHint=""
                  />
                )}
              />
              {errors.email ? <Text style={styles.fieldError}>{errors.email.message}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>{t('auth.password')}</Text>
              <View style={styles.passwordRow}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[
                        styles.input,
                        styles.passwordInput,
                        {
                          color: theme.text,
                          backgroundColor: theme.backgroundElement,
                          borderColor: passwordBorderColor,
                        },
                      ]}
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
                      accessibilityHint=""
                    />
                  )}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessibilityLabel={
                    showPassword ? t('auth.hidePassword') : t('auth.showPassword')
                  }
                  accessibilityHint=""
                >
                  <SymbolView
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={18}
                    tintColor={theme.textSecondary}
                  />
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={styles.fieldError}>{errors.password.message}</Text>
              ) : null}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                { opacity: pressed || isSubmitting ? 0.75 : 1 },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <Text style={styles.submitText}>{t('auth.signIn')}</Text>
              )}
            </Pressable>
          </View>

          <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
            {t('auth.dontHaveAccount')}{' '}
            <Link href={'/sign-up' as Href} style={[styles.toggleLink, { color: theme.text }]}>
              {t('auth.signUp')}
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  container: { width: '100%', maxWidth: 400, alignSelf: 'center', gap: Spacing.four },
  logoSection: { alignItems: 'center', gap: Spacing.three, marginBottom: Spacing.two },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logoImage: { width: '100%', height: '100%' },
  appName: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  errorBanner: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ERROR_BORDER,
    backgroundColor: ERROR_BG,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  errorText: { fontSize: 13, color: ERROR_COLOR },
  form: { gap: Spacing.three },
  field: { gap: Spacing.one },
  label: { fontSize: 14, fontWeight: '500' },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 44 },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldError: { fontSize: 12, color: ERROR_COLOR, marginTop: 2 },
  submitButton: {
    height: 48,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  submitText: { color: WHITE, fontSize: 16, fontWeight: '600' },
  toggleText: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two },
  toggleLink: { fontWeight: '600', textDecorationLine: 'underline' },
});
