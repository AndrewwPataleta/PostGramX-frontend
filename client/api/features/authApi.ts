import { post } from "@/api/core/apiClient";
import { buildTelegramAuthPayload } from "@/api/core/authPayload";
import type { AuthResponse, TelegramUserLike } from "@/types/auth";

export const authTelegram = async (
  initDataToken: string,
  user: TelegramUserLike
): Promise<AuthResponse> => {
  const payload = buildTelegramAuthPayload(initDataToken, user);
  return post<AuthResponse, typeof payload>("/auth", payload);
};

export const authApi = {
  authTelegram,
};
