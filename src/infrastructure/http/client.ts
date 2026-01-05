import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers['X-Request-ID'] = crypto.randomUUID();
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const apiError = new Error(message) as Error & { code?: number; traceId?: string };
      apiError.code = error.response?.data?.code || error.response?.status;
      apiError.traceId = error.response?.data?.trace_id;
      return Promise.reject(apiError);
    }
  );

  return client;
};

export const httpClient = createClient();
