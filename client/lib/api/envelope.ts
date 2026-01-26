import { TELEGRAM_MOCK } from "@/config/env";
import { getTelegramWebApp, mockTelegramAuth } from "@/lib/telegram";

export type TelegramAuthContext = {
  platformType: "telegram";
  authType: "telegram";
  token: string;
};

export type TelegramEnvelope<T> = TelegramAuthContext & {
  data: T;
};

export const withTelegramEnvelope = <T>(
  data: T,
  auth: TelegramAuthContext
): TelegramEnvelope<T> => ({
  ...auth,
  data,
});

export const getTelegramAuthContext = (): TelegramAuthContext => {
  const initData = TELEGRAM_MOCK
    ? mockTelegramAuth.initData
    : getTelegramWebApp()?.initData;

  if (!initData) {
    throw new Error("Telegram init data is missing.");
  }

  return {
    platformType: "telegram",
    authType: "telegram",
    token: initData,
  };
};
