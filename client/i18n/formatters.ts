import type { Language } from "@/i18n/translations";
import { nanoToTonString } from "@/lib/ton";

const getLocale = (language: Language) => (language === "ru" ? "ru-RU" : "en-US");

export const formatNumber = (
  value: number,
  language: Language,
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat(getLocale(language), options).format(value);
};

export const formatTon = (amountNano: string | bigint, language: Language) => {
  try {
    const tonValue = Number(nanoToTonString(amountNano));
    if (Number.isNaN(tonValue)) {
      return nanoToTonString(amountNano);
    }
    return formatNumber(tonValue, language, { maximumFractionDigits: 2 });
  } catch {
    return String(amountNano);
  }
};

export const formatTonValue = (amount: number | string, language: Language) => {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) {
    return String(amount);
  }
  return formatNumber(value, language, { maximumFractionDigits: 2 });
};

export const formatDateTime = (iso: string | undefined | null, language: Language) => {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(getLocale(language), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatDate = (iso: string | undefined | null, language: Language) => {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(getLocale(language), {
    dateStyle: "medium",
  }).format(date);
};
