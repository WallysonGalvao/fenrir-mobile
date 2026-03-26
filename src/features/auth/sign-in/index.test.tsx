import { fireEvent, waitFor } from '@testing-library/react-native';

import { Colors } from '@/constants/theme';
import { renderWithClient } from '@/utils/test/helper';

import SignIn from '.';

const mockSignIn = jest.fn();
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock('./hooks/use-sign-in', () => ({
  useSignIn: () => ({ signIn: mockSignIn }),
}));

jest.mock('@/components/toast', () => ({
  useToast: () => ({ show: jest.fn() }),
  Toast: 'Toast',
  ToastTitle: 'ToastTitle',
  ToastDescription: 'ToastDescription',
}));

jest.mock('@/lib/supabase', () => ({
  supabase: { auth: { signInWithPassword: jest.fn() } },
}));

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => Colors.light,
}));

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
  mockSignIn.mockResolvedValue(undefined);
});

describe('SignIn', () => {
  it('renders sign-in title', () => {
    const { getAllByText } = renderWithClient(<SignIn />);
    expect(getAllByText('auth.signIn').length).toBeGreaterThanOrEqual(1);
  });

  it('renders email and password fields', () => {
    const { getByLabelText } = renderWithClient(<SignIn />);
    expect(getByLabelText('auth.email')).toBeTruthy();
    expect(getByLabelText('auth.password')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    const { getByLabelText, getByText, getAllByText } = renderWithClient(<SignIn />);

    fireEvent.changeText(getByLabelText('auth.email'), 'not-an-email');
    fireEvent.changeText(getByLabelText('auth.password'), 'Abc123#x');

    const buttons = getAllByText('auth.signIn');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('shows validation error for weak password', async () => {
    const { getByLabelText, findByText, getAllByText } = renderWithClient(<SignIn />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.changeText(getByLabelText('auth.password'), 'abc');

    const buttons = getAllByText('auth.signIn');
    fireEvent.press(buttons[buttons.length - 1]);

    expect(await findByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('calls signIn on valid submit', async () => {
    const { getByLabelText, getAllByText } = renderWithClient(<SignIn />);

    fireEvent.changeText(getByLabelText('auth.email'), 'user@example.com');
    fireEvent.changeText(getByLabelText('auth.password'), 'Abc123#x');

    const buttons = getAllByText('auth.signIn');
    fireEvent.press(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Abc123#x',
      });
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = renderWithClient(<SignIn />);

    fireEvent.press(getByTestId('left-icon-0'));

    expect(mockBack).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    const { getByLabelText } = renderWithClient(<SignIn />);

    const passwordInput = getByLabelText('auth.password');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggleButton = getByLabelText('auth.showPassword');
    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('navigates to reset-password when forgot is pressed', () => {
    const { getByText } = renderWithClient(<SignIn />);

    fireEvent.press(getByText('auth.forgotPassword'));

    expect(mockPush).toHaveBeenCalledWith('/reset-password');
  });
});
