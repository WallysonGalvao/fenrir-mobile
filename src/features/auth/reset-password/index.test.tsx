import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithClient } from '@/utils/test/helper';

import ResetPassword from '.';

const mockResetPassword = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('./hooks/use-reset-password', () => ({
  useResetPassword: () => ({ resetPassword: mockResetPassword }),
}));

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: jest.fn() }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { resetPasswordForEmail: jest.fn() } },
}));

jest.mock('@/hooks/use-theme', () => {
  const { Colors } = require('@/constants/theme');
  return { useTheme: () => Colors.light };
});

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: jest.fn(),
    replace: mockReplace,
    navigate: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockResetPassword.mockResolvedValue(undefined);
});

describe('ResetPassword', () => {
  it('renders reset password title', () => {
    const { getByText } = renderWithClient(<ResetPassword />);
    expect(getByText('auth.resetPassword')).toBeTruthy();
  });

  it('renders email field', () => {
    const { getByLabelText } = renderWithClient(<ResetPassword />);
    expect(getByLabelText('auth.email')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    const { getByLabelText, getByText } = renderWithClient(<ResetPassword />);

    fireEvent.changeText(getByLabelText('auth.email'), 'not-an-email');
    fireEvent.press(getByText('auth.sendResetLink'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('calls resetPassword on valid submit', async () => {
    const { getByLabelText, getByText } = renderWithClient(<ResetPassword />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.press(getByText('auth.sendResetLink'));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        onSuccess: expect.any(Function),
      });
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = renderWithClient(<ResetPassword />);

    fireEvent.press(getByTestId('left-icon-0'));

    expect(mockBack).toHaveBeenCalled();
  });

  it('shows success step after successful reset', async () => {
    mockResetPassword.mockImplementation(async ({ onSuccess }) => {
      onSuccess();
    });

    const { getByLabelText, getByText } = renderWithClient(<ResetPassword />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.press(getByText('auth.sendResetLink'));

    await waitFor(() => {
      expect(getByText('auth.resetEmailSent')).toBeTruthy();
    });
  });
});
