import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

import { Platform } from 'react-native';

const isDev = __DEV__;

const dsn = Constants.expoConfig?.extra?.sentryDNS;

Sentry.init({
  dsn,
  environment: isDev ? 'development' : 'production',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: isDev,

  attachScreenshot: !isDev,
  debug: false,

  tracesSampleRate: isDev ? 1.0 : 0.1,

  // Configure Session Replay
  profilesSampleRate: isDev ? 1.0 : 0.05,
  replaysSessionSampleRate: isDev ? 0.1 : 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: !isDev, // Mask PII in production; visible in dev for debugging
      maskAllImages: !isDev, // Mask profile photos and uploads in production
      maskAllVectors: !isDev, // Mask vector icons in production
    }),
    Sentry.feedbackIntegration(),
    ...(isDev ? [Sentry.spotlightIntegration()] : []),
  ],

  beforeSend(event) {
    event.contexts = {
      ...event.contexts,
      device: {
        platform: Platform.OS,
        appVersion: Application?.nativeApplicationVersion || 'unknown',
        buildNumber: Application?.nativeBuildVersion || 'unknown',
      },
    };
    return event;
  },

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: isDev,
});
