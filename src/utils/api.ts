import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/api';

interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let showToast: ((message: string, severity: 'error' | 'success' | 'info' | 'warning') => void) | null = null;

export const setToastContext = (toastFn: typeof showToast) => {
  showToast = toastFn;
};

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle common errors here
    if (axios.isAxiosError(error)) {
      let errorMessage = 'An error occurred';

      if (error.response) {
        errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
        console.error('API Error:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        errorMessage = 'No response received from server';
        console.error('No response received:', error.request);
      } else {
        errorMessage = error.message;
        console.error('Error:', error.message);
      }

      if (showToast) {
        showToast(errorMessage, 'error');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
