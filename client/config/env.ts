const fallbackBaseUrl = "https://backend-stage.postgramx.com";

const resolvedBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL.trim().length > 0
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : fallbackBaseUrl;

export const API_BASE_URL = resolvedBaseUrl;

export const TELEGRAM_MOCK = import.meta.env.VITE_TELEGRAM_MOCK === "true";

export const API_LOG =
  import.meta.env.VITE_API_LOG === "true" || Boolean(import.meta.env.DEV);
