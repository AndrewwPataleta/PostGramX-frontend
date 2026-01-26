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

const request = async <T>(
  method: string,
  url: string,
  payload?: unknown,
  config: RequestConfig = {}
): Promise<ApiClientResponse<T>> => {
  const token = getAuthToken();
  const headers = new Headers(config.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("X-Request-Id", createRequestId());

  const isFormData = payload instanceof FormData;
  if (payload != null && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body: payload == null ? undefined : isFormData ? payload : JSON.stringify(payload),
      signal: config.signal,
    });

    const data = await parseResponseData<T>(response);

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
    if ((error as ApiError)?.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    throw normalizeApiError(error, undefined, (error as ApiError)?.status ?? 0);
  }
};

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) => request<T>("GET", url, undefined, config),
  post: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, payload, config),
};
