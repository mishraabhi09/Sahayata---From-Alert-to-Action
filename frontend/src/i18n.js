import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationNE from "./locales/ne/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationKN from "./locales/kn/translation.json";
import translationBN from "./locales/bn/translation.json";

const resources = {
  en: { translation: translationEN },
  ne: { translation: translationNE },
  hi: { translation: translationHI },
  kn: { translation: translationKN },
  bn: { translation: translationBN },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en", // read saved language from localStorage on init
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
