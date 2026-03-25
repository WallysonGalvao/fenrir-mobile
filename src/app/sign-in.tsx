import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Image, ImageBackground } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
} from 'react-native-reanimated';
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
const LANDING_BUTTON_BG = 'rgba(255, 255, 255, 0.92)';
const LANDING_BUTTON_TEXT = '#1a1a2e';
const WEB_BG = '#F1F3F5';
const WEB_GLOW = 'rgba(32, 138, 239, 0.18)';
const WEB_SIGN_IN_BG = '#E4E6EB';

const isWeb = Platform.OS === 'web';

type Step = 'landing' | 'form';
type SignInFields = { email: string; password: string };

// ---------- Landing (Mobile) ----------

function LandingStepMobile({ onSignIn }: { onSignIn: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/landing-bg.png')}
      style={styles.landingFull}
      contentFit="cover"
    >
      {/* Dark overlay for readability */}
      <View style={styles.landingOverlay} />

      {/* Logo + name centered in the upper area */}
      <View style={styles.landingCenter}>
        <Animated.View entering={FadeInDown.duration(500).delay(0)}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.landingLogo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(80)}>
          <Text style={styles.landingAppName}>{t('auth.appName')}</Text>
        </Animated.View>
      </View>

      {/* Buttons pinned to bottom */}
      <Animated.View entering={FadeInDown.duration(500).delay(160)} style={styles.landingBottom}>
        <Pressable
          style={({ pressed }) => [styles.landingPillButton, { opacity: pressed ? 0.82 : 1 }]}
          onPress={() => router.push('/sign-up' as Href)}
          accessibilityRole="button"
        >
          <Text style={styles.landingPillText}>{t('auth.createAccount')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.landingTextButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={onSignIn}
          accessibilityRole="button"
        >
          <Text style={styles.landingTextButtonLabel}>{t('auth.signIn')}</Text>
        </Pressable>
      </Animated.View>
    </ImageBackground>
  );
}

// ---------- Landing (Web) ----------

function LandingStepWeb({
  onSignIn,
  theme,
}: {
  onSignIn: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.webLandingOuter}>
      {/* Subtle blue glow edges */}
      <View style={styles.webLandingGlow} />

      <View style={styles.webLandingContent}>
        <Animated.View entering={FadeInDown.duration(400).delay(0)}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.webLandingLogo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(60)}
          style={styles.webLandingTextBlock}
        >
          <Text style={[styles.webLandingTitle, { color: theme.text }]}>{t('auth.appName')}</Text>
          <Text style={[styles.webLandingTagline, { color: theme.textSecondary }]}>
            {t('auth.tagline')}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(120)}
          style={styles.webLandingButtons}
        >
          <Pressable
            style={({ pressed }) => [styles.webLandingCreateBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push('/sign-up' as Href)}
            accessibilityRole="button"
          >
            <Text style={styles.webLandingCreateText}>{t('auth.createAccount')}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.webLandingSignInBtn, { opacity: pressed ? 0.75 : 1 }]}
            onPress={onSignIn}
            accessibilityRole="button"
          >
            <Text style={[styles.webLandingSignInText, { color: theme.text }]}>
              {t('auth.signIn')}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// ---------- Form Fields ----------

function FormFields({ onBack, theme }: { onBack: () => void; theme: ReturnType<typeof useTheme> }) {
  const { t } = useTranslation();
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

  const emailBorderColor = errors.email ? ERROR_COLOR : theme.backgroundSelected;
  const passwordBorderColor = errors.password ? ERROR_COLOR : theme.backgroundSelected;

  return (
    <>
      {serverError ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.errorBanner}>
          <Text style={styles.errorText}>{serverError}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.formFields}>
        {/* Account section label */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          {t('auth.account')}
        </Text>

        {/* Email field with @ icon */}
        <View style={styles.fieldWrapper}>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: emailBorderColor,
              },
            ]}
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
                  style={[styles.inputInline, { color: theme.text }]}
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
                />
              )}
            />
          </View>
          {errors.email ? <Text style={styles.fieldError}>{errors.email.message}</Text> : null}
        </View>

        {/* Password field with lock icon + Forgot? */}
        <View style={styles.fieldWrapper}>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: passwordBorderColor,
              },
            ]}
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
                  style={[styles.inputInline, { color: theme.text }]}
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
                />
              )}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityLabel={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              <Text style={[styles.forgotText, { color: theme.textSecondary }]}>
                {t('auth.forgotPassword')}
              </Text>
            </Pressable>
          </View>
          {errors.password ? (
            <Text style={styles.fieldError}>{errors.password.message}</Text>
          ) : null}
        </View>
      </View>

      {/* Submit - different layout on web vs mobile */}
      {isWeb ? (
        <View style={styles.webButtonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.webBackButton,
              { borderColor: theme.backgroundSelected, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={onBack}
            accessibilityRole="button"
          >
            <Text style={[styles.webBackText, { color: theme.textSecondary }]}>
              {t('auth.backToLanding')}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.webSubmitButton,
              { opacity: pressed || isSubmitting ? 0.75 : 1 },
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <Text style={styles.webSubmitText}>{t('auth.signIn')}</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.mobileSubmitButton,
            { opacity: pressed || isSubmitting ? 0.75 : 1 },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <Text style={styles.mobileSubmitText}>{t('auth.signIn')}</Text>
          )}
        </Pressable>
      )}
    </>
  );
}

// ---------- Form Step Mobile ----------

function FormStepMobile({
  onBack,
  theme,
}: {
  onBack: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInRight.duration(320)}
      exiting={FadeOutLeft.duration(220)}
      style={styles.mobileFormContainer}
    >
      {/* Header: back arrow + centered logo */}
      <View style={styles.mobileHeader}>
        <Pressable
          style={({ pressed }) => [styles.backArrow, { opacity: pressed ? 0.6 : 1 }]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('auth.backToLanding')}
        >
          <SymbolView
            name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
            size={22}
            tintColor={theme.text}
          />
        </Pressable>
        <View style={styles.mobileHeaderLogo}>
          <Image
            source={require('@/assets/images/fenrir-logo.png')}
            style={styles.smallLogo}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        {/* Spacer for centering */}
        <View style={styles.backArrow} />
      </View>

      {/* Title */}
      <Text style={[styles.formTitle, { color: theme.text }]}>{t('auth.signIn')}</Text>

      <FormFields onBack={onBack} theme={theme} />
    </Animated.View>
  );
}

// ---------- Form Step Web (two columns, Bluesky-style split) ----------

function FormStepWeb({
  onBack,
  theme,
}: {
  onBack: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      style={styles.webFormOuter}
    >
      {/* Subtle blue glow edges */}
      <View style={styles.webLandingGlow} />

      <View style={styles.webTwoColumn}>
        {/* Left column: title (slightly darker bg) */}
        <View style={styles.webLeftColumn}>
          <View style={styles.webLeftColumnInner}>
            <Text style={styles.webTitle}>{t('auth.signIn')}</Text>
            <Text style={[styles.webSubtitle, { color: theme.textSecondary }]}>
              {t('auth.signInSubtitle')}
            </Text>
          </View>
        </View>

        {/* Right column: form (lighter bg) */}
        <View style={styles.webRightColumn}>
          <View style={styles.webRightColumnInner}>
            <FormFields onBack={onBack} theme={theme} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// ---------- Root ----------

export default function SignIn() {
  const theme = useTheme();
  const [step, setStep] = React.useState<Step>('landing');

  const content = (
    <>
      {step === 'landing' ? (
        <Animated.View
          key="landing"
          entering={FadeIn.duration(280)}
          exiting={FadeOut.duration(180)}
          style={styles.flex}
        >
          {isWeb ? (
            <LandingStepWeb onSignIn={() => setStep('form')} theme={theme} />
          ) : (
            <LandingStepMobile onSignIn={() => setStep('form')} />
          )}
        </Animated.View>
      ) : isWeb ? (
        <FormStepWeb onBack={() => setStep('landing')} theme={theme} />
      ) : (
        <ScrollView
          key="form-mobile"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.mobileScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <FormStepMobile onBack={() => setStep('landing')} theme={theme} />
        </ScrollView>
      )}
    </>
  );

  if (isWeb) {
    return <View style={[styles.flex, { backgroundColor: theme.background }]}>{content}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // ── Landing ──
  landingFull: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: Spacing.four,
  },
  landingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  landingCenter: {
    alignItems: 'center',
    gap: Spacing.two,
    zIndex: 1,
  },
  landingLogo: {
    width: 82,
    height: 82,
  },
  landingAppName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: WHITE,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  landingBottom: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: Spacing.three,
    alignItems: 'center',
    zIndex: 1,
  },
  landingPillButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LANDING_BUTTON_BG,
  },
  landingPillText: {
    fontSize: 17,
    fontWeight: '600',
    color: LANDING_BUTTON_TEXT,
  },
  landingTextButton: {
    paddingVertical: Spacing.two,
  },
  landingTextButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: WHITE,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // ── Mobile Form ──
  mobileScrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  mobileFormContainer: {
    flex: 1,
    gap: Spacing.four,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileHeaderLogo: {
    alignItems: 'center',
  },
  smallLogo: {
    width: 32,
    height: 32,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  // ── Web Landing ──
  webLandingOuter: {
    flex: 1,
    backgroundColor: WEB_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLandingGlow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 8,
    borderColor: WEB_GLOW,
    borderRadius: 0,
  },
  webLandingContent: {
    alignItems: 'center',
    gap: Spacing.four,
    zIndex: 1,
    maxWidth: 400,
    width: '100%',
    paddingHorizontal: Spacing.four,
  },
  webLandingLogo: {
    width: 72,
    height: 72,
  },
  webLandingTextBlock: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  webLandingTitle: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  webLandingTagline: {
    fontSize: 18,
    lineHeight: 24,
  },
  webLandingButtons: {
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  webLandingCreateBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLandingCreateText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  webLandingSignInBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: WEB_SIGN_IN_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webLandingSignInText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // ── Web Form (two columns, split layout) ──
  webFormOuter: {
    flex: 1,
    backgroundColor: WEB_BG,
  },
  webTwoColumn: {
    flex: 1,
    flexDirection: 'row',
  },
  webLeftColumn: {
    flex: 4,
    backgroundColor: WEB_BG,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.six,
  },
  webLeftColumnInner: {
    maxWidth: 360,
    width: '100%',
    gap: Spacing.two,
  },
  webTitle: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    color: PRIMARY_COLOR,
  },
  webSubtitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  webRightColumn: {
    flex: 6,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.six,
  },
  webRightColumnInner: {
    maxWidth: 480,
    width: '100%',
    gap: Spacing.four,
  },
  webButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  webBackButton: {
    height: 42,
    paddingHorizontal: Spacing.four,
    borderRadius: 21,
    backgroundColor: WEB_SIGN_IN_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webBackText: { fontSize: 15, fontWeight: '600' },
  webSubmitButton: {
    height: 42,
    paddingHorizontal: Spacing.five,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webSubmitText: { color: WHITE, fontSize: 15, fontWeight: '600' },

  // ── Shared form fields ──
  formFields: { gap: Spacing.two },
  sectionLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  fieldWrapper: { gap: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  inputInline: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  forgotText: { fontSize: 13, fontWeight: '500' },
  fieldError: { fontSize: 12, color: ERROR_COLOR, paddingLeft: Spacing.one },

  // ── Mobile submit ──
  mobileSubmitButton: {
    height: 48,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  mobileSubmitText: { color: WHITE, fontSize: 16, fontWeight: '600' },

  // ── Error ──
  errorBanner: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ERROR_BORDER,
    backgroundColor: ERROR_BG,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  errorText: { fontSize: 13, color: ERROR_COLOR },
});
