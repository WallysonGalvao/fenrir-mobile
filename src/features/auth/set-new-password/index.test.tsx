import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithClient } from '@/utils/test/helper';

import SetNewPassword from '.';

const mockSetNewPassword = jest.fn();

jest.mock('./hooks/use-set-new-password', () => ({
  useSetNewPassword: () => ({ setNewPassword: mockSetNewPassword }),
}));

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: jest.fn() }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { updateUser: jest.fn() } },
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
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock('@/stores/auth', () => ({
  useSession: Object.assign(
    jest.fn(() => ({})),
    {
      setState: jest.fn(),
    },
  ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSetNewPassword.mockResolvedValue(undefined);
});

describe('SetNewPassword', () => {
  it('renders set new password title', () => {
    const { getAllByText } = renderWithClient(<SetNewPassword />);
    expect(getAllByText('auth.setNewPassword').length).toBeGreaterThanOrEqual(1);
  });

  it('renders password and confirm password fields', () => {
    const { getByLabelText } = renderWithClient(<SetNewPassword />);
    expect(getByLabelText('auth.newPassword')).toBeTruthy();
    expect(getByLabelText('auth.confirmPassword')).toBeTruthy();
  });

  it('shows validation error for weak password', async () => {
    const { getByLabelText, findByText, getAllByText } = renderWithClient(<SetNewPassword />);

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'abc');
    fireEvent.changeText(getByLabelText('auth.confirmPassword'), 'abc');

    const buttons = getAllByText('auth.setNewPassword');
    fireEvent.press(buttons[buttons.length - 1]);

    expect(await findByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('shows validation error for mismatched passwords', async () => {
    const { getByLabelText, findByText, getAllByText } = renderWithClient(<SetNewPassword />);

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'Abc123#x');
    fireEvent.changeText(getByLabelText('auth.confirmPassword'), 'Different1#');

    const buttons = getAllByText('auth.setNewPassword');
    fireEvent.press(buttons[buttons.length - 1]);

    expect(await findByText('Passwords do not match')).toBeTruthy();
  });

  it('calls setNewPassword on valid submit', async () => {
    const { getByLabelText, getAllByText } = renderWithClient(<SetNewPassword />);

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'Abc123#x');
    fireEvent.changeText(getByLabelText('auth.confirmPassword'), 'Abc123#x');

    const buttons = getAllByText('auth.setNewPassword');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mockSetNewPassword).toHaveBeenCalledWith({
        password: 'Abc123#x',
        onSuccess: expect.any(Function),
      });
    });
  });

  it('toggles password visibility', () => {
    const { getByLabelText, getAllByLabelText } = renderWithClient(<SetNewPassword />);

    const passwordInput = getByLabelText('auth.newPassword');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggleButtons = getAllByLabelText('auth.showPassword');
    fireEvent.press(toggleButtons[0]);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('shows success step after successful password update', async () => {
    mockSetNewPassword.mockImplementation(async ({ onSuccess }) => {
      onSuccess();
    });

    const { getByLabelText, getByText, getAllByText } = renderWithClient(<SetNewPassword />);

    fireEvent.changeText(getByLabelText('auth.newPassword'), 'Abc123#x');
    fireEvent.changeText(getByLabelText('auth.confirmPassword'), 'Abc123#x');

    const buttons = getAllByText('auth.setNewPassword');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(getByText('auth.passwordUpdated')).toBeTruthy();
    });
  });
});
