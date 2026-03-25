import { createContext, useContext } from 'react';

export function createAuthContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useAuthContext(): T {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`${name} must be used within its Provider`);
    return ctx;
  }

  return { Provider: Context, useContext: useAuthContext } as const;
}
