import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(@react-native|react-native' +
      '|expo|@expo|expo-font|@expo/vector-icons|expo-asset|expo-image|expo-localization|expo-modules-core' +
      '|expo-constants|expo-crypto|expo-device|expo-application|expo-linking|expo-symbols|expo-secure-store' +
      '|expo-splash-screen|expo-status-bar|expo-system-ui|expo-web-browser|expo-glass-effect' +
      '|@react-navigation|react-native-reanimated|react-native-worklets' +
      '|react-native-css|react-native-mmkv|react-native-screens|react-native-svg' +
      '|react-native-safe-area-context|react-native-gesture-handler|react-native-nitro-modules' +
      '|nativewind|@gluestack-ui|@sentry/react-native' +
      '|@expo-google-fonts)/)',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^expo-symbols$': '<rootDir>/__mocks__/expo-symbols.tsx',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  collectCoverageFrom: ['<rootDir>/src/features/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/__tests__/',
    '\\.test\\.tsx?$',
  ],
};

export default config;
