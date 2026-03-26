import { renderHookWithClient } from '@/utils/test/helper';

import { useResetPassword } from './use-reset-password';

const mockShow = jest.fn();

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: mockShow }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

const mockResetPasswordForEmail = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: (...args: unknown[]) => mockResetPasswordForEmail(...args),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useResetPassword', () => {
  const email = 'user@example.com';
  const mockOnSuccess = jest.fn();

  it('calls resetPasswordForEmail with correct email and redirectTo', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useResetPassword());
    await result.current.resetPassword({ email, onSuccess: mockOnSuccess });

    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(email, {
      redirectTo: expect.any(String),
    });
  });

  it('calls onSuccess callback on successful reset', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useResetPassword());
    await result.current.resetPassword({ email, onSuccess: mockOnSuccess });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockShow).not.toHaveBeenCalled();
  });

  it('shows error toast on failed reset', async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: { message: 'Rate limit exceeded' },
    });

    const { result } = renderHookWithClient(() => useResetPassword());
    await result.current.resetPassword({ email, onSuccess: mockOnSuccess });

    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'reset-password-error',
        placement: 'top',
        duration: 4000,
        render: expect.any(Function),
      }),
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
