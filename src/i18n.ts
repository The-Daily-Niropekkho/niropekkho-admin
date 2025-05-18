import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import bnTranslation from "./lang/bn/translation.json";
import enTranslation from "./lang/en/translation.json";

i18n.use(LanguageDetector) // Detects browser language
    .use(initReactI18next) // Binds i18next to React
    .init({
        resources: {
            en: { translation: enTranslation },
            bn: { translation: bnTranslation },
        },
        fallbackLng: "en", // Fallback language
        supportedLngs: ["en", "bn"], // Supported languages
        interpolation: {
            escapeValue: false, // React handles XSS
        },
        detection: {
            order: ["localStorage", "navigator"], // Check localStorage, then browser
            caches: ["localStorage"], // Persist language in localStorage
        },
    });

export default i18n;
