import 'react-native-gesture-handler/jestSetup';

jest.mock('@/utils/storage-key', () => ({
  getMMKVEncryptionKey: () => 'test-mmkv-key',
  initMMKVEncryptionKey: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.useReducedMotion = () => false;

  if (typeof Reanimated.createAnimatedComponent !== 'function') {
    Reanimated.createAnimatedComponent = (Component) => Component;
  }

  return Reanimated;
});

jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  Link: 'Link',
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  ReactNavigationInstrumentation: jest.fn(),
  ReactNativeTracing: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
  unloadAsync: jest.fn(() => Promise.resolve()),
  useFonts: jest.fn(() => [true, null]),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
}));

jest.mock('expo-crypto', () => ({
  getRandomBytesAsync: jest.fn(async (n) => new Uint8Array(n)),
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
  Trans: ({ children }) => {
    if (typeof children === 'string') return children;
    return children;
  },
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));
