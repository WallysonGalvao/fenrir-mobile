import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en';
import pt from './pt';

const supportedLanguages = ['en', 'pt-BR'];

const getBestLanguageTag = (): string => {
  const locale = Localization.getLocales()[0]?.languageTag.toLowerCase();
  const matched = supportedLanguages.find((lang) => locale.startsWith(lang.toLowerCase()));
  return matched || 'en';
};

const getInitialLanguage = (): string => {
  const systemLanguage = getBestLanguageTag();
  return systemLanguage;
};

const initialLanguage = getInitialLanguage();

const i18n = createInstance();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: initialLanguage,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    'pt-BR': { translation: pt },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
