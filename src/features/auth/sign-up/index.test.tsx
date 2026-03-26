import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithClient } from '@/utils/test/helper';

import SignUp from '.';

const mockSignUp = jest.fn();
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('./hooks/use-sign-up', () => ({
  useSignUp: () => ({ signUp: mockSignUp }),
}));

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: jest.fn() }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signUp: jest.fn() } },
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
    push: mockPush,
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockSignUp.mockResolvedValue(undefined);
});

describe('SignUp', () => {
  it('renders sign-up title', () => {
    const { getAllByText } = renderWithClient(<SignUp />);
    expect(getAllByText('auth.signUp').length).toBeGreaterThanOrEqual(1);
  });

  it('renders email and password fields', () => {
    const { getByLabelText } = renderWithClient(<SignUp />);
    expect(getByLabelText('auth.email')).toBeTruthy();
    expect(getByLabelText('auth.password')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    const { getByLabelText, getByText, getAllByText } = renderWithClient(<SignUp />);

    fireEvent.changeText(getByLabelText('auth.email'), 'not-an-email');
    fireEvent.changeText(getByLabelText('auth.password'), 'Abc123#x');

    const buttons = getAllByText('auth.signUp');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('shows validation error for weak password', async () => {
    const { getByLabelText, findByText, getAllByText } = renderWithClient(<SignUp />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.changeText(getByLabelText('auth.password'), 'abc');

    const buttons = getAllByText('auth.signUp');
    fireEvent.press(buttons[buttons.length - 1]);

    expect(await findByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('calls signUp on valid submit', async () => {
    const { getByLabelText, getAllByText } = renderWithClient(<SignUp />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.changeText(getByLabelText('auth.password'), 'Abc123#x');

    const buttons = getAllByText('auth.signUp');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Abc123#x',
        onSuccess: expect.any(Function),
      });
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = renderWithClient(<SignUp />);

    fireEvent.press(getByTestId('left-icon-0'));

    expect(mockBack).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    const { getByLabelText } = renderWithClient(<SignUp />);

    const passwordInput = getByLabelText('auth.password');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggleButton = getByLabelText('auth.showPassword');
    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('shows success step after successful sign-up', async () => {
    mockSignUp.mockImplementation(async ({ onSuccess }) => {
      onSuccess();
    });

    const { getByLabelText, getByText, getAllByText } = renderWithClient(<SignUp />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.changeText(getByLabelText('auth.password'), 'Abc123#x');

    const buttons = getAllByText('auth.signUp');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(getByText('auth.checkEmail')).toBeTruthy();
    });
  });

  it('navigates to sign-in when link is pressed', () => {
    const { getByText } = renderWithClient(<SignUp />);

    fireEvent.press(getByText('auth.signIn'));

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });
});
