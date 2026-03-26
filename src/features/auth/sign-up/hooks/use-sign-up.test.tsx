import { renderHookWithClient } from '@/utils/test/helper';

import { useSignUp } from './use-sign-up';

const mockShow = jest.fn();

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: mockShow }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

const mockSignUp = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSignUp', () => {
  const credentials = { email: 'user@example.com', password: 'Abc123#x' };
  const mockOnSuccess = jest.fn();

  it('calls signUp with correct credentials', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSignUp());
    await result.current.signUp({ ...credentials, onSuccess: mockOnSuccess });

    expect(mockSignUp).toHaveBeenCalledWith(credentials);
  });

  it('calls onSuccess callback on successful sign-up', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    const { result } = renderHookWithClient(() => useSignUp());
    await result.current.signUp({ ...credentials, onSuccess: mockOnSuccess });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockShow).not.toHaveBeenCalled();
  });

  it('shows error toast on failed sign-up', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
    });

    const { result } = renderHookWithClient(() => useSignUp());
    await result.current.signUp({ ...credentials, onSuccess: mockOnSuccess });

    expect(mockShow).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sign-up-error',
        placement: 'top',
        duration: 4000,
        render: expect.any(Function),
      }),
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
