// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

const LANGUAGE_STORAGE_KEY = 'app-language';

// Supported languages
export const LANGUAGES = {
  en: { name: 'English', code: 'EN' },
  es: { name: 'Español', code: 'ES' },
  fr: { name: 'Français', code: 'FR' },
  de: { name: 'Deutsch', code: 'DE' },
  pt: { name: 'Português', code: 'PT' },
} as const;

export type SupportedLanguage = keyof typeof LANGUAGES;

// Translation resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
};

/**
 * Get saved language from AsyncStorage or device locale
 */
const getInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    // Check AsyncStorage first
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && savedLanguage in LANGUAGES) {
      return savedLanguage as SupportedLanguage;
    }

    // Fall back to device locale
    const deviceLocale = Localization.getLocales()[0];
    const deviceLanguageCode = deviceLocale?.languageCode || 'en';

    // Map device locale to supported language
    if (deviceLanguageCode in LANGUAGES) {
      return deviceLanguageCode as SupportedLanguage;
    }

    return 'en'; // Default to English
  } catch (error) {
    console.warn('Failed to get initial language, defaulting to English:', error);
    return 'en';
  }
};

/**
 * Initialize i18n
 */
export const initI18n = async (): Promise<void> => {
  const initialLanguage = await getInitialLanguage();

  await i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      compatibilityJSON: 'v3', // Required for React Native
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      react: {
        useSuspense: false, // Disable suspense for React Native
      },
    });
};

/**
 * Change app language and persist to AsyncStorage
 */
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Failed to change language:', error);
    throw error;
  }
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language || 'en') as SupportedLanguage;
};

/**
 * Get translations for a specific namespace (useful for PDF generation)
 */
export const getTranslations = (keys: string[]): Record<string, string> => {
  const translations: Record<string, string> = {};
  keys.forEach((key) => {
    translations[key] = i18n.t(key);
  });
  return translations;
};

export default i18n;
