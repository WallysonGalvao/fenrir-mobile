import { createAuthContext } from '../shared/create-auth-context';

type ResetPasswordContextValue = {
  onBack: () => void;
  onSuccess: () => void;
};

export const { Provider: ResetPasswordContext, useContext: useResetPassword } =
  createAuthContext<ResetPasswordContextValue>('useResetPassword');
