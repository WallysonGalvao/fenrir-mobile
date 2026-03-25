import { createContext, useContext } from 'react';

type ResetPasswordContextValue = {
  onBack: () => void;
  onSuccess: () => void;
};

export const ResetPasswordContext = createContext<ResetPasswordContextValue | null>(null);

export function useResetPassword() {
  const ctx = useContext(ResetPasswordContext);
  if (!ctx) throw new Error('useResetPassword must be used within ResetPasswordContext');
  return ctx;
}
