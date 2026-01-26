import { API_BASE_URL } from "@/config/env";
import { AUTH_EXPIRED_EVENT, clearAuthToken, getAuthToken } from "@/lib/api/auth";
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

const logRequest = ({
  requestId,
  method,
  url,
  headers,
  payload,
}: {
  requestId: string;
  method: string;
  url: string;
  headers: Headers;
  payload: unknown;
}) => {
  console.info("[api] request", {
    requestId,
    method,
    url,
    headers: Object.fromEntries(headers.entries()),
    payload: serializePayload(payload),
  });
};

const logResponse = ({
  requestId,
  method,
  url,
  status,
  data,
}: {
  requestId: string;
  method: string;
  url: string;
  status: number;
  data: unknown;
}) => {
  console.info("[api] response", {
    requestId,
    method,
    url,
    status,
    data,
  });
};

const logError = ({
  requestId,
  method,
  url,
  status,
  error,
}: {
  requestId: string;
  method: string;
  url: string;
  status: number;
  error: ApiError;
}) => {
  console.error("[api] error", {
    requestId,
    method,
    url,
    status,
    error,
  });
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

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("X-Request-Id", requestId);

  const isFormData = payload instanceof FormData;
  if (payload != null && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  try {
    logRequest({ requestId, method, url, headers, payload });

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: payload == null ? undefined : isFormData ? payload : JSON.stringify(payload),
      signal: config.signal,
    });

    const data = await parseResponseData<T>(response);
    logResponse({ requestId, method, url, status: response.status, data });

    if (!response.ok) {
      const normalized = normalizeApiError(new Error(response.statusText), data, response.status);
      if (normalized.status === 401 && typeof window !== "undefined") {
        clearAuthToken();
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
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
    logError({
      requestId,
      method,
      url,
      status: normalizedError.status,
      error: normalizedError,
    });

    if ((error as ApiError)?.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    throw normalizedError;
  }
};

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) => request<T>("GET", url, undefined, config),
  post: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, payload, config),
};
