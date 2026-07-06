import axios from 'axios';

const httpHelper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

httpHelper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = require('@/stores/authStore');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    const message = error.response?.data?.error?.message || error.message || 'Something went wrong';
    import('@/stores/uiStore').then(({ useUIStore }) => {
      useUIStore.getState().addToast({ type: 'error', message });
    });
    return Promise.reject(error);
  }
);

export default httpHelper;
