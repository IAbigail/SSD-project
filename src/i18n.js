import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importing translation files
import en from './locales/en.json';  // English
import fr from './locales/fr.json';  // French
import ro from './locales/ro.json';  // Romanian

// Initializing i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ro: { translation: ro },
    },
    fallbackLng: 'en',
    lng: navigator.language.split('-')[0], // Automatically detect browser language
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;