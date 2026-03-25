import React from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FormStep } from './components/form-step';
import { LandingStep } from './components/landing-step';
import { SignInContext } from './context';

type Step = 'landing' | 'form';

const isWeb = Platform.OS === 'web';

export default function SignIn() {
  const [step, setStep] = React.useState<Step>('landing');
  const ctx = React.useMemo(() => ({ onBack: () => setStep('landing') }), []);

  const content =
    step === 'landing' ? (
      <Animated.View
        key="landing"
        entering={FadeIn.duration(280)}
        exiting={FadeOut.duration(180)}
        className="flex-1"
      >
        <LandingStep onSignIn={() => setStep('form')} />
      </Animated.View>
    ) : (
      <SignInContext value={ctx}>
        {isWeb ? (
          <FormStep />
        ) : (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="grow px-6 py-4"
            keyboardShouldPersistTaps="handled"
          >
            <FormStep />
          </ScrollView>
        )}
      </SignInContext>
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
