import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api-client';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseAxiosOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: T;
  config?: AxiosRequestConfig;
  immediate?: boolean;
}

interface UseAxiosReturn<TData, TError> {
  data: TData | null;
  error: TError | null;
  loading: boolean;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useAxios<TData = any, TError = any, TPayload = any>(
  options: UseAxiosOptions<TPayload>
): UseAxiosReturn<TData, TError> {
  const { url, method = 'GET', data, config, immediate = true } = options;

  const [responseData, setResponseData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response: AxiosResponse<TData>;

      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get<TData>(url, config);
          break;
        case 'POST':
          response = await apiClient.post<TData>(url, data, config);
          break;
        case 'PUT':
          response = await apiClient.put<TData>(url, data, config);
          break;
        case 'PATCH':
          response = await apiClient.patch<TData>(url, data, config);
          break;
        case 'DELETE':
          response = await apiClient.delete<TData>(url, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      setResponseData(response.data);
    } catch (err: any) {
      setError(err.response?.data || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, method, data, config]);

  const reset = useCallback(() => {
    setResponseData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return {
    data: responseData,
    error,
    loading,
    execute,
    reset,
  };
}

