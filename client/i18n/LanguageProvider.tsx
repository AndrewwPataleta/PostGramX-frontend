import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTelegram } from "@/hooks/use-telegram";
import { getTelegramWebApp } from "@/lib/telegram";
import { Language, TranslationKey, translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "postgramx.language";

const isLanguage = (value: string | null): value is Language =>
  value === "ru" || value === "en";

const getStoredLanguage = (): Language | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLanguage(stored)) {
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

const loadCloudLanguage = async (): Promise<Language | null> => {
  const webApp = getTelegramWebApp();
  const cloudStorage = webApp?.CloudStorage;
  if (!cloudStorage?.getItem) {
    return null;
  }

  return new Promise((resolve) => {
    cloudStorage.getItem(STORAGE_KEY, (error, value) => {
      if (error) {
        resolve(null);
        return;
      }

      resolve(isLanguage(value) ? value : null);
    });
  });
};

const saveCloudLanguage = (language: Language) => {
  const webApp = getTelegramWebApp();
  const cloudStorage = webApp?.CloudStorage;
  if (!cloudStorage?.setItem) {
    return;
  }

  cloudStorage.setItem(STORAGE_KEY, language);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useTelegram();
  const storedLanguageRef = useRef<Language | null>(getStoredLanguage());
  const [language, setLanguageState] = useState<Language>(
    storedLanguageRef.current ?? detectLanguage(user?.language_code)
  );

  useEffect(() => {
    let cancelled = false;

    const hydrateLanguage = async () => {
      const cloudLanguage = await loadCloudLanguage();
      if (cancelled) {
        return;
      }

      if (cloudLanguage) {
        storedLanguageRef.current = cloudLanguage;
        setLanguageState(cloudLanguage);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, cloudLanguage);
        }
        return;
      }

      if (!storedLanguageRef.current) {
        setLanguageState(detectLanguage(user?.language_code));
      }
    };

    void hydrateLanguage();

    return () => {
      cancelled = true;
    };
  }, [user?.language_code]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    storedLanguageRef.current = nextLanguage;
    setLanguageState(nextLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
    saveCloudLanguage(nextLanguage);
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
