import React from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FormStepMobile } from './components/form-step-mobile';
import { FormStepWeb } from './components/form-step-web';
import { SuccessStepMobile } from './components/success-step-mobile';
import { SuccessStepWeb } from './components/success-step-web';
import { SetNewPasswordContext } from './context';

const isWeb = Platform.OS === 'web';

type Step = 'form' | 'success';

export default function SetNewPassword() {
  const [step, setStep] = React.useState<Step>('form');

  const ctx = React.useMemo(
    () => ({
      onSuccess: () => setStep('success'),
    }),
    [],
  );

  const content = (
    <>
      {step === 'form' ? (
        <SetNewPasswordContext value={ctx}>
          <Animated.View
            key="form"
            entering={FadeIn.duration(280)}
            exiting={FadeOut.duration(180)}
            className="flex-1"
          >
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
          </Animated.View>
        </SetNewPasswordContext>
      ) : (
        <Animated.View
          key="success"
          entering={FadeIn.duration(280)}
          exiting={FadeOut.duration(180)}
          className="flex-1"
        >
          {isWeb ? (
            <SuccessStepWeb />
          ) : (
            <View className="flex-1 px-6 py-4">
              <SuccessStepMobile />
            </View>
          )}
        </Animated.View>
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
