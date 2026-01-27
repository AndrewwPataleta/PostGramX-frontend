import { AUTH_EXPIRED_EVENT, getAuthToken } from "@/lib/api/auth";
import { ApiError, parseBackendError } from "@/api/core/apiErrors";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SENSITIVE_KEYS = new Set([
  "token",
  "initdata",
  "init_data",
  "authorization",
]);

const redactString = (value: string) => {
  const trimmed = value.trim();
  const prefix = trimmed.slice(0, 20);
  return `${prefix}...(redacted)`;
};

const redactValue = (value: unknown, key?: string): unknown => {
  if (typeof value === "string") {
    const normalizedKey = key ? key.toLowerCase() : undefined;
    if (normalizedKey && SENSITIVE_KEYS.has(normalizedKey)) {
      return redactString(value);
    }
    if (value.toLowerCase().startsWith("bearer ")) {
      return `Bearer ${redactString(value.slice(7))}`;
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [entryKey, entryValue]) => {
        acc[entryKey] = redactValue(entryValue, entryKey);
        return acc;
      },
      {}
    );
  }

  return value;
};

const logRequest = (url: string, payload: unknown, headers: Headers) => {
  if (!import.meta.env.DEV) {
    return;
  }

  console.log("[API] -> POST", url, {
    headers: redactValue(Object.fromEntries(headers.entries())),
    body: redactValue(payload),
  });
};

const logResponse = (url: string, status: number, payload: unknown) => {
  if (!import.meta.env.DEV) {
    return;
  }

  console.log("[API] <-", status, url, redactValue(payload));
};

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const buildUrl = (path: string) => {
  const baseUrl = normalizeBaseUrl(BASE_URL ?? "");
  if (!path.startsWith("/")) {
    return `${baseUrl}/${path}`;
  }
  return `${baseUrl}${path}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

export const post = async <TResponse, TData>(
  path: string,
  data?: TData,
  options?: { headers?: Record<string, string> }
): Promise<TResponse> => {
  const url = buildUrl(path);
  const payload = { data: data ?? {} };
  const headers = new Headers({
    "Content-Type": "application/json",
    ...options?.headers,
  });

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  logRequest(url, payload, headers);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const parsed = await parseResponseBody(response);
  logResponse(url, response.status, parsed);

  if (!response.ok) {
    const message = parseBackendError(parsed, response.statusText || "Request failed");
    if (response.status === 401) {
      dispatchAuthExpired();
    }
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as TResponse;
};

let hasDispatchedAuthExpired = false;
let authExpiredTimeout: number | null = null;

const dispatchAuthExpired = () => {
  if (typeof window === "undefined" || hasDispatchedAuthExpired) {
    return;
  }
  hasDispatchedAuthExpired = true;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));

  if (authExpiredTimeout) {
    window.clearTimeout(authExpiredTimeout);
  }

  authExpiredTimeout = window.setTimeout(() => {
    hasDispatchedAuthExpired = false;
    authExpiredTimeout = null;
  }, 2000);
};
