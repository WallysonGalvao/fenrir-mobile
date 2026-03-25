import React from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FormStepMobile } from './components/form-step-mobile';
import { FormStepWeb } from './components/form-step-web';
import { LandingStepMobile } from './components/landing-step-mobile';
import { LandingStepWeb } from './components/landing-step-web';
import { SignInContext } from './context';

const isWeb = Platform.OS === 'web';

type Step = 'landing' | 'form';

// ---------- Root ----------

export default function SignIn() {
  const [step, setStep] = React.useState<Step>('landing');
  const ctx = React.useMemo(() => ({ onBack: () => setStep('landing') }), []);

  const content = (
    <>
      {step === 'landing' ? (
        <Animated.View
          key="landing"
          entering={FadeIn.duration(280)}
          exiting={FadeOut.duration(180)}
          className="flex-1"
        >
          {isWeb ? (
            <LandingStepWeb onSignIn={() => setStep('form')} />
          ) : (
            <LandingStepMobile onSignIn={() => setStep('form')} />
          )}
        </Animated.View>
      ) : (
        <SignInContext value={ctx}>
          {isWeb ? (
            <FormStepWeb />
          ) : (
            <ScrollView
              key="form-mobile"
              contentInsetAdjustmentBehavior="automatic"
              contentContainerClassName="grow px-6 py-4"
              keyboardShouldPersistTaps="handled"
            >
              <FormStepMobile />
            </ScrollView>
          )}
        </SignInContext>
      )}
    </>
  );

  if (isWeb) {
    return <View className="flex-1 bg-background dark:bg-background-dark">{content}</View>;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-background-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  );
}
