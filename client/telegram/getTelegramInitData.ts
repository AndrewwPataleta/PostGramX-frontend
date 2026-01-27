import { getTelegramWebApp, mockTelegramAuth } from "@/lib/telegram";

const TELEGRAM_MOCK = import.meta.env.VITE_TELEGRAM_MOCK === "true";

export const getTelegramInitDataToken = (): string => {
  const webApp = getTelegramWebApp();
  const initData = webApp?.initData;

  if (initData && initData.trim().length > 0) {
    return initData;
  }

  if (TELEGRAM_MOCK) {
    return mockTelegramAuth.initData;
  }

  throw new Error("Telegram initData missing");
};
