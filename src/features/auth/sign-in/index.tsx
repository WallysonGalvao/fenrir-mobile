import { useRouter } from 'expo-router';

import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { FormStep } from './components/form-step';

const isWeb = Platform.OS === 'web';

export default function SignIn() {
  const router = useRouter();
  const onBack = () => router.back();

  if (isWeb) {
    return <FormStep onBack={onBack} />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-background-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="grow px-6 py-4"
        keyboardShouldPersistTaps="handled"
      >
        <FormStep onBack={onBack} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
