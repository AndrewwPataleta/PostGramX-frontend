import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "@/config/env";
import { AUTH_EXPIRED_EVENT } from "@/lib/api/auth";
import {
  buildAuthRequest,
  clearSession,
  getAccessToken,
  getTelegramInitDataToken,
  refreshSession,
} from "@/features/auth/telegramAuth";
import type { ApiError } from "@/types/api";

type ApiClientResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
};

type RequestConfig = AxiosRequestConfig & {
  wrap?: boolean;
};

type RetryableRequestConfig = AxiosRequestConfig & {
  __isRetry?: boolean;
  wrap?: boolean;
};

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const normalizeApiError = (error: unknown, status = 0): ApiError => {
  if (error instanceof AxiosError) {
    return {
      code: (error.response?.data as { code?: string })?.code ?? "API_ERROR",
      message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Request failed",
      status: error.response?.status ?? status,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      code: "API_ERROR",
      message: error.message || "Request failed",
      status,
      details: null,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Unexpected error",
    status,
    details: null,
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

const wrapPayload = (data: unknown) => {
  const request = buildAuthRequest(false);
  return {
    platformType: request.platformType,
    authType: request.authType,
    token: request.token,
    data,
  };
};

const withSessionExpired = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
  }
};

api.interceptors.request.use((config) => {
  const requestConfig = config as RetryableRequestConfig;
  const token = getAccessToken();
  const initData = getTelegramInitDataToken();

  requestConfig.headers = requestConfig.headers ?? {};
  requestConfig.headers["X-Request-Id"] = createRequestId();

  if (initData) {
    requestConfig.headers["X-Telegram-Init-Data"] = initData;
  }

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const method = requestConfig.method?.toLowerCase();
  if (
    requestConfig.wrap &&
    requestConfig.data !== undefined &&
    (method === "post" || method === "put" || method === "patch")
  ) {
    requestConfig.data = wrapPayload(requestConfig.data);
  }

  return requestConfig;
});

let refreshPromise: Promise<void> | null = null;

const runRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as RetryableRequestConfig | undefined;

    if ((status === 401 || status === 403) && config && !config.__isRetry) {
      config.__isRetry = true;
      try {
        await runRefresh();
        return api.request(config);
      } catch (refreshError) {
        clearSession();
        withSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 || status === 403) {
      clearSession();
      withSessionExpired();
    }

    return Promise.reject(error);
  }
);

const request = async <T>(
  config: AxiosRequestConfig
): Promise<ApiClientResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.request<T>(config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    throw normalizeApiError(error, (error as AxiosError)?.response?.status ?? 0);
  }
};

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>({
      url,
      method: "get",
      ...config,
    }),
  post: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>({
      url,
      method: "post",
      data: payload,
      ...config,
    }),
  put: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>({
      url,
      method: "put",
      data: payload,
      ...config,
    }),
  patch: <T>(url: string, payload?: unknown, config?: RequestConfig) =>
    request<T>({
      url,
      method: "patch",
      data: payload,
      ...config,
    }),
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>({
      url,
      method: "delete",
      ...config,
    }),
};
