export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface TelegramInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  safeAreaInset?: Partial<TelegramInsets>;
  contentSafeAreaInset?: Partial<TelegramInsets>;
  onEvent?: (event: "viewportChanged", handler: () => void) => void;
  offEvent?: (event: "viewportChanged", handler: () => void) => void;
  ready?: () => void;
  expand?: () => void;
}

export const DEFAULT_INSETS: TelegramInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const mockTelegramUser: TelegramUser = {
  id: 999999,
  first_name: "Local",
  last_name: "Tester",
  username: "localtester",
  language_code: "en",
};

export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
};

export const normalizeInsets = (
  insets?: Partial<TelegramInsets> | null
): TelegramInsets => ({
  top: insets?.top ?? 0,
  right: insets?.right ?? 0,
  bottom: insets?.bottom ?? 0,
  left: insets?.left ?? 0,
});

const parseUserFromInitData = (initData?: string): TelegramUser | null => {
  if (!initData) {
    return null;
  }

  const params = new URLSearchParams(initData);
  const rawUser = params.get("user");
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as TelegramUser;
  } catch {
    try {
      return JSON.parse(decodeURIComponent(rawUser)) as TelegramUser;
    } catch {
      return null;
    }
  }
};

export const getTelegramUser = (webApp: TelegramWebApp | null): TelegramUser | null => {
  if (!webApp) {
    return null;
  }

  return webApp.initDataUnsafe?.user ?? parseUserFromInitData(webApp.initData);
};

export const ensureWebAppReady = (webApp: TelegramWebApp) => {
  webApp.ready?.();
  webApp.expand?.();
};

export const setInsetCssVars = (
  safe: TelegramInsets,
  content: TelegramInsets
) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--tg-safe-top", `${safe.top}px`);
  root.style.setProperty("--tg-safe-right", `${safe.right}px`);
  root.style.setProperty("--tg-safe-bottom", `${safe.bottom}px`);
  root.style.setProperty("--tg-safe-left", `${safe.left}px`);
  root.style.setProperty(
    "--tg-content-safe-area-inset-top",
    `${content.top}px`
  );
  root.style.setProperty(
    "--tg-content-safe-area-inset-right",
    `${content.right}px`
  );
  root.style.setProperty(
    "--tg-content-safe-area-inset-bottom",
    `${content.bottom}px`
  );
  root.style.setProperty(
    "--tg-content-safe-area-inset-left",
    `${content.left}px`
  );
};
