import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { Language, TranslationKey, translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "postgramx.language";

const getStoredLanguage = (): Language | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ru" || stored === "en") {
    return stored;
  }

  return null;
};

const detectLanguage = (languageCode?: string | null): Language => {
  if (languageCode?.toLowerCase().startsWith("ru")) {
    return "ru";
  }

  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useTelegram();
  const storedLanguageRef = useRef<Language | null>(getStoredLanguage());
  const [language, setLanguageState] = useState<Language>(
    storedLanguageRef.current ?? detectLanguage(user?.language_code)
  );

  useEffect(() => {
    if (storedLanguageRef.current) {
      return;
    }

    setLanguageState(detectLanguage(user?.language_code));
  }, [user?.language_code]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    storedLanguageRef.current = nextLanguage;
    setLanguageState(nextLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key] ?? translations.en[key] ?? key;
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
