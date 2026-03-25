import { lazy } from 'react';

const SignInFormScreen = lazy(() => import('@/features/auth/sign-in'));

export default function SignInRoute() {
  return <SignInFormScreen />;
}
