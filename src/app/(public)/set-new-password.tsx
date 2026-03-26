import { lazy } from 'react';

const SetNewPasswordScreen = lazy(() => import('@/features/auth/set-new-password'));

export default function SetNewPasswordRoute() {
  return <SetNewPasswordScreen />;
}
