import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiClient } from "@/lib/api/client";
import { clearAuthToken, setAuthToken } from "@/lib/api/auth";
import {
  getTelegramUser,
  getTelegramWebApp,
  mockTelegramAuth,
  TelegramUser,
} from "@/lib/telegram";
import { TELEGRAM_MOCK } from "@/config/env";
import type { ApiError } from "@/types/api";

type AuthError = {
  type: "missing_telegram" | "auth_failed";
  message: string;
  debug?: string;
};

type AuthContextValue = {
  isReady: boolean;
  isLoading: boolean;
  user: unknown | null;
  accessToken: string | null;
  error: AuthError | null;
  initSession: () => Promise<{ ok: boolean }>;
  retry: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildAuthPayload = (initData: string, user: TelegramUser) => ({
  platformType: "telegram",
  authType: "telegram",
  token: initData,
  data: {
    id: user.id,
    username: user.username ?? "",
    firstName: user.first_name ?? "",
    lastName: user.last_name ?? "",
    lang: user.language_code ?? "en",
    isPremium: user.is_premium ?? false,
  },
});

const extractAuthResult = (payload: unknown) => {
  const root = payload as Record<string, unknown> | null;
  const nested = (root?.data as Record<string, unknown> | null) ?? root;

  const accessToken =
    (nested?.accessToken as string | undefined) ??
    (nested?.token as string | undefined) ??
    (root?.accessToken as string | undefined) ??
    (root?.token as string | undefined) ??
    null;

  const user =
    (nested?.user as unknown) ??
    (nested?.profile as unknown) ??
    (root?.user as unknown) ??
    (root?.profile as unknown) ??
    null;

  return { accessToken, user };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<unknown | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const inFlightRef = useRef(false);

  const initSession = useCallback(async () => {
    if (inFlightRef.current) {
      return { ok: false };
    }
    inFlightRef.current = true;
    setIsLoading(true);
    setIsReady(false);
    setError(null);

    try {
      const webApp = getTelegramWebApp();
      const initData = TELEGRAM_MOCK ? mockTelegramAuth.initData : webApp?.initData;
      const telegramUser = TELEGRAM_MOCK
        ? mockTelegramAuth.user
        : getTelegramUser(webApp);

      if (!initData || !telegramUser) {
        setIsReady(false);
        setUser(null);
        setAccessToken(null);
        clearAuthToken();
        setError({
          type: "missing_telegram",
          message: "Open inside Telegram to continue.",
        });
        return { ok: false };
      }

      const payload = buildAuthPayload(initData, telegramUser);
      const response = await apiClient.post<unknown>("/auth/init", payload);
      const { accessToken: nextToken, user: profile } = extractAuthResult(response.data);

      if (nextToken) {
        setAuthToken(nextToken);
        setAccessToken(nextToken);
      } else {
        setAccessToken(null);
      }

      setUser(profile ?? telegramUser ?? null);
      setIsReady(true);
      setError(null);
      return { ok: true };
    } catch (err) {
      const apiError = err as ApiError;
      setIsReady(false);
      setUser(null);
      setAccessToken(null);
      clearAuthToken();
      setError({
        type: "auth_failed",
        message: apiError.message || "Could not connect to the server.",
        debug: apiError.code ? `${apiError.code} (${apiError.status})` : undefined,
      });
      return { ok: false };
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    void initSession();
  }, [initSession]);

  const value = useMemo(
    () => ({
      isReady,
      isLoading,
      user,
      accessToken,
      error,
      initSession,
      retry,
    }),
    [isReady, isLoading, user, accessToken, error, initSession, retry]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
