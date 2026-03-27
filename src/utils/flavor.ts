import Constants from 'expo-constants';

export type AppVariant = 'development' | 'preview' | 'production';

export function getAppVariant(): AppVariant {
  const raw = Constants.expoConfig?.extra?.appVariant;
  if (raw === 'development' || raw === 'preview' || raw === 'production') return raw;
  return 'development';
}

export const isDevelopment = () => getAppVariant() === 'development';
export const isPreview = () => getAppVariant() === 'preview';
export const isProduction = () => getAppVariant() === 'production';
