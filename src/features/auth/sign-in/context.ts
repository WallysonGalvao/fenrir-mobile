import { createContext, useContext } from 'react';

type SignInContextValue = {
  onBack: () => void;
};

export const SignInContext = createContext<SignInContextValue | null>(null);

export function useSignIn() {
  const ctx = useContext(SignInContext);
  if (!ctx) throw new Error('useSignIn must be used within SignInContext');
  return ctx;
}
