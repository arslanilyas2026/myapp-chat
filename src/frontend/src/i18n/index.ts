/**
 * i18next initialization
 *
 * Supports: English (en), Spanish (es), Portuguese (pt)
 * Detection order: localStorage → browser language → fallback to 'en'
 */

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import es from "../locales/es.json";
import pt from "../locales/pt.json";

export const SUPPORTED_LANGUAGES = ["en", "es", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "myapp_language",
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
