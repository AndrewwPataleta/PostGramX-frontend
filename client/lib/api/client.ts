import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/config/env";
import { AUTH_EXPIRED_EVENT, clearAuthToken, getAuthToken } from "@/lib/api/auth";
import type { ApiError } from "@/types/api";

const createRequestId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const normalizeApiError = (error: AxiosError | Error): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const responseData = error.response?.data;
    const message =
      (responseData as { message?: string })?.message ||
      error.message ||
      "Request failed";

    return {
      code: (responseData as { code?: string })?.code || "API_ERROR",
      message,
      status,
      details: responseData,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: error.message || "Unexpected error",
    status: 0,
  };
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  config.headers = {
    ...config.headers,
    "X-Request-Id": createRequestId(),
  };

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError | Error) => {
    const normalized = normalizeApiError(error);

    if (normalized.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(normalized);
  }
);
