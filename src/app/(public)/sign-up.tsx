import { lazy } from 'react';

const SignUpScreen = lazy(() => import('@/features/auth/sign-up'));

export default function SignUpRoute() {
  return <SignUpScreen />;
}
