import { lazy } from 'react';

const ResetPasswordScreen = lazy(() => import('@/features/auth/reset-password'));

export default function ResetPasswordRoute() {
  return <ResetPasswordScreen />;
}
