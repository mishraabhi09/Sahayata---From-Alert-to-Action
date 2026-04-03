import { create } from "zustand";
import i18n from "../i18n";

const defaultPrefs = {
  theme: "light",
  fontSize: "base",
  fontFamily: "arial",
  language: "en", // Default language
};

const usePreferences = create((set) => ({
  ...defaultPrefs,

  setTheme: (theme) => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
    set({ theme });
  },

  setFontSize: (fontSize) => {
    localStorage.setItem("fontSize", fontSize);
    set({ fontSize });
  },

  setFontFamily: (fontFamily) => {
    localStorage.setItem("fontFamily", fontFamily);
    set({ fontFamily });
  },

  // ✅ Now actually changes the i18n language immediately on selection
  setLanguage: (language) => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language); // Instantly updates the whole website
    set({ language });
  },

  loadPreferences: () => {
    const theme = localStorage.getItem("theme") || "light";
    const fontSize = localStorage.getItem("fontSize") || "base";
    const fontFamily = localStorage.getItem("fontFamily") || "sans";
    const language = localStorage.getItem("language") || "en";

    document.body.classList.add(`theme-${theme}`);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    i18n.changeLanguage(language); // Apply saved language on load
    set({ theme, fontSize, fontFamily, language });
  },
}));

export default usePreferences;
