import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiResponse, AuthResponse } from '@/types/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Access Token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post<ApiResponse<AuthResponse>>(
          `${baseURL}/auth/refresh`,
          { refreshToken }
        );

        const newAuthData = refreshResponse.data.data;
        useAuthStore.getState().setTokens(newAuthData.accessToken, newAuthData.refreshToken);

        processQueue(null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAuthData.accessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
