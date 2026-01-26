import axios from "axios";
import { z } from "zod";
import { API_BASE_URL } from "@/config/env";
import { getAuthToken, setAuthToken, clearAuthToken } from "@/lib/api/auth";
import { getInitData, getUserUnsafe } from "@/lib/telegram";
import type { AuthRequest, CreateUserRequest } from "@/types/auth";

export type AuthUser = Record<string, unknown>;

const AUTH_USER_KEY = "postgramx_auth_user";
const TELEGRAM_INIT_DATA_KEY = "postgramx_telegram_init_data";

const AUTH_INIT_ENDPOINT =
  typeof import.meta.env.VITE_AUTH_INIT_ENDPOINT === "string" &&
  import.meta.env.VITE_AUTH_INIT_ENDPOINT.trim().length > 0
    ? import.meta.env.VITE_AUTH_INIT_ENDPOINT.trim()
    : "/auth/init";

const TelegramUserSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
});

type TelegramUserSchema = z.infer<typeof TelegramUserSchema>;

const authClient = axios.create({
  baseURL: API_BASE_URL,
});

let accessToken: string | null = null;
let sessionUser: AuthUser | null = null;
let telegramInitData: string | null = null;

const loadStoredSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!accessToken) {
    accessToken = getAuthToken();
  }

  if (!sessionUser) {
    const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        sessionUser = JSON.parse(storedUser) as AuthUser;
      } catch {
        sessionUser = null;
      }
    }
  }

  if (!telegramInitData) {
    telegramInitData = window.localStorage.getItem(TELEGRAM_INIT_DATA_KEY);
  }
};

loadStoredSession();

const normalizeUser = (user: TelegramUserSchema): CreateUserRequest => ({
  id: user.id,
  username: user.username,
  firstName: user.first_name,
  lastName: user.last_name,
  lang: user.language_code,
  isPremium: user.is_premium,
});

export const buildAuthRequest = (includeUserData: boolean): AuthRequest => {
  const token = getInitData();
  if (!token) {
    throw new Error("Missing Telegram init data");
  }

  const request: AuthRequest = {
    platformType: "telegram",
    authType: "telegram",
    token,
  };

  if (includeUserData) {
    const unsafeUser = getUserUnsafe();
    const parsed = TelegramUserSchema.safeParse(unsafeUser ?? undefined);
    if (!parsed.success) {
      throw new Error("Missing Telegram user profile");
    }
    request.data = normalizeUser(parsed.data);
  }

  return request;
};

const persistSession = (nextUser: AuthUser | null, nextToken?: string | null) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TELEGRAM_INIT_DATA_KEY, getInitData());

    if (nextUser) {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  if (nextToken) {
    accessToken = nextToken;
    setAuthToken(nextToken);
  }

  sessionUser = nextUser;
  telegramInitData = getInitData();
};

export const getAccessToken = () => {
  if (!accessToken) {
    accessToken = getAuthToken();
  }

  return accessToken;
};

export const getSessionUser = () => sessionUser;

export const getTelegramInitDataToken = () => telegramInitData ?? getInitData();

export const clearSession = () => {
  accessToken = null;
  sessionUser = null;
  telegramInitData = null;
  clearAuthToken();

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.localStorage.removeItem(TELEGRAM_INIT_DATA_KEY);
  }
};

type AuthResponse = {
  accessToken?: string;
  user?: AuthUser;
};

export const initSession = async (): Promise<void> => {
  const request = buildAuthRequest(true);
  const response = await authClient.post<AuthResponse>(AUTH_INIT_ENDPOINT, request, {
    headers: {
      "X-Telegram-Init-Data": request.token,
    },
  });

  const nextToken = response.data.accessToken ?? null;
  const nextUser = response.data.user ?? null;

  persistSession(nextUser, nextToken);
  if (!nextToken) {
    accessToken = null;
    clearAuthToken();
  }
};

export const refreshSession = async (): Promise<void> => {
  const request = buildAuthRequest(false);
  const response = await authClient.post<AuthResponse>(AUTH_INIT_ENDPOINT, request, {
    headers: {
      "X-Telegram-Init-Data": request.token,
    },
  });

  const nextToken = response.data.accessToken ?? null;
  const nextUser = response.data.user ?? sessionUser;

  if (nextToken) {
    persistSession(nextUser ?? null, nextToken);
  } else if (nextUser) {
    persistSession(nextUser, accessToken);
  }
};
