import axios from 'axios';

const httpHelper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handles 401 and error toasting
httpHelper.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear auth state and redirect
      const { useAuthStore } = require('@/stores/authStore');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // Surface error message from standardized envelope
    const message =
      error.response?.data?.error?.message || error.message || 'Something went wrong';

    // Import UI store lazily to avoid circular deps
    import('@/stores/uiStore').then(({ useUIStore }) => {
      useUIStore.getState().addToast({
        type: 'error',
        message,
      });
    });

    return Promise.reject(error);
  }
);

export default httpHelper;
