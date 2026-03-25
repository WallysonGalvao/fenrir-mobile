import { lazy } from 'react';

const SignInScreen = lazy(() => import('@/features/auth/sign-in'));

export default function SignInRoute() {
  return <SignInScreen />;
}
