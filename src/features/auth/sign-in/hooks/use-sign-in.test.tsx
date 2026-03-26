import { renderHookWithClient } from '@/utils/test/helper';

import { useSignIn } from './use-sign-in';

const mockShow = jest.fn();

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: mockShow }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

const mockSignInWithPassword = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSignIn', () => {
  const credentials = { email: 'user@example.com', password: 'Abc123#x' };

  it('calls signInWithPassword with correct credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSignIn());
    await result.current.signIn(credentials);

    expect(mockSignInWithPassword).toHaveBeenCalledWith(credentials);
  });

  it('does not show toast on successful sign-in', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSignIn());
    await result.current.signIn(credentials);

    expect(mockShow).not.toHaveBeenCalled();
  });

  it('shows error toast on failed sign-in', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    const { result } = renderHookWithClient(() => useSignIn());
    await result.current.signIn(credentials);

    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sign-in-error',
        placement: 'top',
        duration: 4000,
        render: expect.any(Function),
      }),
    );
  });
});
