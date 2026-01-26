const fallbackBaseUrl = "https://postgramx.com/api";

const resolvedBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL.trim().length > 0
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : fallbackBaseUrl;

export const API_BASE_URL = resolvedBaseUrl;
