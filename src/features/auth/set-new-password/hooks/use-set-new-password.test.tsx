import { renderHookWithClient } from '@/utils/test/helper';

import { useSetNewPassword } from './use-set-new-password';

const mockShow = jest.fn();

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: mockShow }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

const mockUpdateUser = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSetNewPassword', () => {
  const password = 'NewPass123#';
  const mockOnSuccess = jest.fn();

  it('calls updateUser with correct password', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSetNewPassword());
    await result.current.setNewPassword({ password, onSuccess: mockOnSuccess });

    expect(mockUpdateUser).toHaveBeenCalledWith({ password });
  });

  it('calls onSuccess callback on successful update', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSetNewPassword());
    await result.current.setNewPassword({ password, onSuccess: mockOnSuccess });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockShow).not.toHaveBeenCalled();
  });

  it('shows error toast on failed update', async () => {
    mockUpdateUser.mockResolvedValue({
      error: { message: 'Password update failed' },
    });

    const { result } = renderHookWithClient(() => useSetNewPassword());
    await result.current.setNewPassword({ password, onSuccess: mockOnSuccess });

    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'set-new-password-error',
        placement: 'top',
        duration: 4000,
        render: expect.any(Function),
      }),
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
