import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  readStoredLocale,
  writeStoredLocale,
  type AppLocale,
} from "./locale-storage";
import en from "./locales/en";
import fr from "./locales/fr";

const initialLocale = readStoredLocale();
document.documentElement.lang = initialLocale;

void i18n.use(initReactI18next).init({
  resources: { en, fr },
  lng: initialLocale,
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "landing", "auth", "docs", "editor"],
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (lng === "en" || lng === "fr") {
    document.documentElement.lang = lng;
    writeStoredLocale(lng);
  }
});

export function setAppLocale(locale: AppLocale): void {
  void i18n.changeLanguage(locale);
}

export default i18n;
