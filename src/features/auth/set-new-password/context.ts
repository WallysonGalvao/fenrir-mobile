import { createAuthContext } from '../shared/create-auth-context';

type SetNewPasswordContextValue = {
  onSuccess: () => void;
};

export const { Provider: SetNewPasswordContext, useContext: useSetNewPassword } =
  createAuthContext<SetNewPasswordContextValue>('useSetNewPassword');
