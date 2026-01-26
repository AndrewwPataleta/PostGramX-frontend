import { API_BASE_URL, API_LOG } from "@/config/env";
import { AUTH_EXPIRED_EVENT, getAuthToken } from "@/lib/api/auth";
import type { ApiError } from "@/types/api";

type ApiClientResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
};

type RequestConfig = {
  headers?: HeadersInit;
  signal?: AbortSignal;
};

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const normalizeApiError = (
  error: unknown,
  details?: unknown,
  status = 0
): ApiError => {
  if (error instanceof Error) {
    return {
      code: (details as { code?: string })?.code || "API_ERROR",
      message: (details as { message?: string })?.message || error.message || "Request failed",
      status,
      details,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: (details as { message?: string })?.message || "Unexpected error",
    status,
    details,
  };
};

const parseResponseData = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
};

const serializePayload = (payload: unknown) => {
  if (payload instanceof FormData) {
    return Array.from(payload.entries()).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (key in acc) {
          const existing = acc[key];
          acc[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
  }

  return payload;
};

const SENSITIVE_KEYS = new Set([
  "token",
  "initData",
  "init_data",
  "accessToken",
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
    const isSensitiveKey = normalizedKey ? SENSITIVE_KEYS.has(normalizedKey) : false;
    if (isSensitiveKey) {
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

const redactHeaders = (headers: Headers) =>
  redactValue(Object.fromEntries(headers.entries()));

const logRequest = ({
  requestId,
  method,
  url,
  headers,
  payload,
  timestamp,
}: {
  requestId: string;
  method: string;
  url: string;
  headers: Headers;
  payload: unknown;
  timestamp: string;
}) => {
  if (!API_LOG) {
    return;
  }
  console.info(`[API] -> ${method} ${url} (reqId=${requestId}, t0=${timestamp})`);
  console.info("Headers:", redactHeaders(headers));
  if (payload != null) {
    console.info("Body:", redactValue(serializePayload(payload)));
  }
};

const logResponse = ({
  requestId,
  method,
  url,
  status,
  data,
  durationMs,
}: {
  requestId: string;
  method: string;
  url: string;
  status: number;
  data: unknown;
  durationMs: number;
}) => {
  if (!API_LOG) {
    return;
  }
  console.info(
    `[API] <- ${status} ${method} ${url} (reqId=${requestId}, ms=${durationMs})`
  );
  console.info("Resp:", redactValue(data));
};

const logError = ({
  requestId,
  method,
  url,
  status,
  error,
  durationMs,
}: {
  requestId: string;
  method: string;
  url: string;
  status: number;
  error: ApiError;
  durationMs: number;
}) => {
  if (!API_LOG) {
    return;
  }
  console.error(
    `[API] !! ${status} ${method} ${url} (reqId=${requestId}, ms=${durationMs})`
  );
  console.error("Error:", error.message);
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

const request = async <T>(
  method: string,
  url: string,
  payload?: unknown,
  config: RequestConfig = {}
): Promise<ApiClientResponse<T>> => {
  const token = getAuthToken();
  const headers = new Headers(config.headers);
  const requestId = createRequestId();
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const timestamp = new Date().toISOString();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("X-Request-Id", requestId);

  const isFormData = payload instanceof FormData;
  if (payload != null && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  try {
    logRequest({ requestId, method, url, headers, payload, timestamp });

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: payload == null ? undefined : isFormData ? payload : JSON.stringify(payload),
      signal: config.signal,
    });

    const data = await parseResponseData<T>(response);
    const durationMs =
      (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime;
    logResponse({
      requestId,
      method,
      url,
      status: response.status,
      data,
      durationMs: Math.round(durationMs),
    });

    if (!response.ok) {
      const normalized = normalizeApiError(new Error(response.statusText), data, response.status);
      if (normalized.status === 401) {
        dispatchAuthExpired();
      }
      throw normalized;
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    const normalizedError = normalizeApiError(error, undefined, (error as ApiError)?.status ?? 0);
    const durationMs =
      (typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime;
    logError({
      requestId,
      method,
      url,
      status: normalizedError.status,
      error: normalizedError,
      durationMs: Math.round(durationMs),
    });

    if ((error as ApiError)?.status === 401) {
      dispatchAuthExpired();
    }

    throw normalizedError;
  }
};

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) => request<T>("GET", url, undefined, config),
  post: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, payload, config),
};
