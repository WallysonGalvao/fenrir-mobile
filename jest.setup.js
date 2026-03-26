/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }) => <View>{children}</View>,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    NativeViewGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    TouchableOpacity: View,
    TouchableWithoutFeedback: View,
    Directions: {},
    gestureHandlerRootHOC: (Component) => Component,
  };
});

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');

  const Animated = {
    View,
    Text,
    ScrollView,
    createAnimatedComponent: (Component) => Component,
  };

  return {
    __esModule: true,
    default: Animated,
    createAnimatedComponent: (Component) => Component,
    useAnimatedStyle: () => ({}),
    useSharedValue: (val) => ({ value: val }),
    withTiming: (val) => val,
    withSpring: (val) => val,
    withDelay: (_, val) => val,
    FadeIn: { duration: () => ({ duration: () => ({}) }) },
    FadeOut: { duration: () => ({ duration: () => ({}) }) },
    FadeInRight: { duration: () => ({ duration: () => ({}) }) },
    FadeOutLeft: { duration: () => ({ duration: () => ({}) }) },
    SlideInUp: { duration: () => ({ duration: () => ({}) }) },
    Animated,
    View,
  };
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
