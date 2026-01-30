import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { Language, TranslationKey, translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "app_lang";

const isLanguage = (value: string | null): value is Language =>
  value === "ru" || value === "en";

const normalizeLanguage = (languageCode?: string | null): Language | null => {
  if (!languageCode) {
    return null;
  }
  const normalized = languageCode.trim().toLowerCase().split("-")[0];
  if (normalized === "ru") {
    return "ru";
  }
  if (normalized === "en") {
    return "en";
  }
  return null;
};

const getStoredLanguage = (): Language | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLanguage(stored) ? stored : null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useTelegram();
  const [language, setLanguageState] = useState<Language>(
    normalizeLanguage(user?.language_code) ?? getStoredLanguage() ?? "en"
  );

  useEffect(() => {
    const telegramLanguage = normalizeLanguage(user?.language_code);
    if (telegramLanguage) {
      setLanguageState(telegramLanguage);
      return;
    }

    const stored = getStoredLanguage();
    if (stored) {
      setLanguageState(stored);
    }
  }, [user?.language_code]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const template = translations[language][key] ?? translations.en[key] ?? key;
      if (!params) {
        return template;
      }
      return Object.entries(params).reduce(
        (result, [paramKey, paramValue]) =>
          result.replaceAll(`{${paramKey}}`, String(paramValue)),
        template
      );
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
