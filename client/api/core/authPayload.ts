import { mockTelegramAuth } from "@/lib/telegram";
import type { AuthRequest, TelegramAuthData, TelegramUserLike } from "@/types/auth";

const isMockMode = import.meta.env.VITE_TELEGRAM_MOCK === "true";

const resolveUserValue = (user: TelegramUserLike, key: keyof TelegramUserLike) =>
  user[key];

const normalizeUser = (user: TelegramUserLike): TelegramAuthData => {
  const username =
    (resolveUserValue(user, "username") as string | null | undefined) ?? "";
  const firstName =
    (resolveUserValue(user, "firstName") as string | null | undefined) ??
    (resolveUserValue(user, "first_name") as string | null | undefined) ??
    "";
  const lastName =
    (resolveUserValue(user, "lastName") as string | null | undefined) ??
    (resolveUserValue(user, "last_name") as string | null | undefined) ??
    "";
  const lang =
    (resolveUserValue(user, "lang") as string | null | undefined) ??
    (resolveUserValue(user, "language_code") as string | null | undefined) ??
    "en";
  const isPremium =
    (resolveUserValue(user, "isPremium") as boolean | null | undefined) ??
    (resolveUserValue(user, "is_premium") as boolean | null | undefined) ??
    false;

  return {
    id: user.id,
    username: username ?? "",
    firstName,
    lastName,
    lang,
    isPremium,
  };
};

const buildPayload = (token: string, user: TelegramUserLike): AuthRequest => ({
  platformType: "telegram",
  authType: "telegram",
  token,
  data: normalizeUser(user),
});

export const buildTelegramAuthPayload = (
  initDataToken?: string,
  user?: TelegramUserLike | null
): AuthRequest => {
  if (isMockMode || !initDataToken || !user) {
    return buildPayload(mockTelegramAuth.initData, mockTelegramAuth.user);
  }

  return buildPayload(initDataToken, user);
};
