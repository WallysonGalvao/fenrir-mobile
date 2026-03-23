const { withRozeniteExpoAtlasPlugin } = require('@rozenite/expo-atlas-plugin');
const { withRozenite } = require('@rozenite/metro');
const { withRozeniteWeb } = require('@rozenite/web/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

module.exports = withRozenite(withNativewind(config), {
  enabled: process.env.WITH_ROZENITE === 'true',
  enhanceMetroConfig: (c) => withRozeniteExpoAtlasPlugin(withRozeniteWeb(c)),
});
