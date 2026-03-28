import { config as loadEnv } from 'dotenv';
import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppVariant = 'development' | 'preview' | 'production';

function getAppVariant(): AppVariant {
  const raw = process.env.APP_VARIANT;
  if (raw === 'development' || raw === 'preview' || raw === 'production') return raw;
  return 'development';
}

const variant = getAppVariant();

// Load flavor-specific env first, then fall back to base .env
loadEnv({ path: `.env.${variant}`, override: false });
loadEnv({ path: '.env', override: false });

const variantConfig: Record<
  AppVariant,
  { name: string; iosBundleIdentifier: string; androidPackage: string }
> = {
  development: {
    name: 'Fenrir (Dev)',
    iosBundleIdentifier: 'com.threewolves.fenrir.development',
    androidPackage: 'com.threewolves.fenrir.development',
  },
  preview: {
    name: 'Fenrir (Preview)',
    iosBundleIdentifier: 'com.threewolves.fenrir.preview',
    androidPackage: 'com.threewolves.fenrir.preview',
  },
  production: {
    name: 'Fenrir',
    iosBundleIdentifier: 'com.threewolves.fenrir',
    androidPackage: 'com.threewolves.fenrir',
  },
};

const configForVariant = variantConfig[variant];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: configForVariant.name,
  slug: 'fenrir',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'fenrir',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: configForVariant.iosBundleIdentifier,
  },
  android: {
    package: configForVariant.androidPackage,
    adaptiveIcon: {
      backgroundColor: '#CFE8F7',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0B1F3A',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'threewolves-boilerplate',
        organization: 'wgsoftwares',
      },
    ],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    appVariant: variant,
    sentryDNS: process.env.SENTRY_DSN,
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    eas: {
      projectId: process.env.EAS_PROJECT_ID || '',
    },
  },
});
