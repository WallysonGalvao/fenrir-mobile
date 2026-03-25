import { createContext, useContext } from 'react';

type SetNewPasswordContextValue = {
  onSuccess: () => void;
};

export const SetNewPasswordContext = createContext<SetNewPasswordContextValue | null>(null);

export function useSetNewPassword() {
  const ctx = useContext(SetNewPasswordContext);
  if (!ctx) throw new Error('useSetNewPassword must be used within SetNewPasswordContext');
  return ctx;
}
