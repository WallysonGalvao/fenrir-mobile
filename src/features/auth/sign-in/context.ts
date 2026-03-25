import { createAuthContext } from '../shared/create-auth-context';

type SignInContextValue = {
  onBack: () => void;
};

export const { Provider: SignInContext, useContext: useSignIn } =
  createAuthContext<SignInContextValue>('useSignIn');
