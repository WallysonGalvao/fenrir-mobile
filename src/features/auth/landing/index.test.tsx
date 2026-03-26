import { fireEvent } from '@testing-library/react-native';

import { renderWithClient } from '@/utils/test/helper';

import { Landing } from '.';

const mockPush = jest.fn();

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: (props: any) => <View {...props} />,
    ImageBackground: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: mockPush,
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Landing', () => {
  it('renders app name', () => {
    const { getByText } = renderWithClient(<Landing />);
    expect(getByText('auth.appName')).toBeTruthy();
  });

  it('renders create account button', () => {
    const { getByText } = renderWithClient(<Landing />);
    expect(getByText('auth.createAccount')).toBeTruthy();
  });

  it('renders sign in button', () => {
    const { getByText } = renderWithClient(<Landing />);
    expect(getByText('auth.signIn')).toBeTruthy();
  });

  it('navigates to sign-up when create account is pressed', () => {
    const { getByText } = renderWithClient(<Landing />);

    fireEvent.press(getByText('auth.createAccount'));

    expect(mockPush).toHaveBeenCalledWith('/sign-up');
  });

  it('navigates to sign-in when sign in is pressed', () => {
    const { getByText } = renderWithClient(<Landing />);

    fireEvent.press(getByText('auth.signIn'));

    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });
});
