import React from 'react';

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FormStep } from './components/form-step';
import { SuccessStep } from './components/success-step';

type Step = 'form' | 'success';

const isWeb = Platform.OS === 'web';

export default function SetNewPassword() {
  const [step, setStep] = React.useState<Step>('form');

  const onSuccess = () => setStep('success');

  const content =
    step === 'form' ? (
      <Animated.View
        key="form"
        entering={FadeIn.duration(280)}
        exiting={FadeOut.duration(180)}
        className="flex-1"
      >
        {isWeb ? (
          <FormStep onSuccess={onSuccess} />
        ) : (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="grow px-6 py-4"
            keyboardShouldPersistTaps="handled"
          >
            <FormStep onSuccess={onSuccess} />
          </ScrollView>
        )}
      </Animated.View>
    ) : (
      <Animated.View
        key="success"
        entering={FadeIn.duration(280)}
        exiting={FadeOut.duration(180)}
        className="flex-1"
      >
        {isWeb ? (
          <SuccessStep />
        ) : (
          <View className="flex-1 px-6 py-4">
            <SuccessStep />
          </View>
        )}
      </Animated.View>
    );

  if (isWeb) {
    return <View className="flex-1 bg-background">{content}</View>;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  );
}
