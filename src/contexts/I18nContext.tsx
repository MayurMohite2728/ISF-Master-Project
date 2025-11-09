import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation keys structure
interface Translations {
  [key: string]: string | Translations;
}

// Import translations
import enTranslations from "@/locales/en.json";
import arTranslations from "@/locales/ar.json";

const translations: Record<Language, Translations> = {
  en: enTranslations,
  ar: arTranslations,
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem("language") as Language;
    return saved === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
    // Update HTML dir and lang attributes
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};

