import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Normalize base URL - remove trailing slash to avoid double slashes
const getBaseURL = (): string => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
};

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Log warning if no token is found for protected routes
      if (config.url && !config.url.includes('/auth/')) {
        console.warn('No authentication token found for request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error?.response?.data?.message || error.message || 'An error occurred';
    
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      sessionStorage.removeItem('token');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (status === 403) {
      // Forbidden - user doesn't have permission
      toast.error(message || 'Access forbidden. You do not have permission to access this resource.');
    } else if (status && status !== 200) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

