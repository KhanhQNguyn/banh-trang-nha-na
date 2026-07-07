import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const httpHelper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

httpHelper.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Dedupe concurrent refresh attempts so a burst of 401s (e.g. several requests
// in flight when the access token expires) triggers a single refresh call.
let refreshPromise = null;

httpHelper.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isRefreshEndpoint = config?.url?.includes('/auth/refresh-token');
    const isAuthEndpoint = config?.url?.includes('/auth/login') || isRefreshEndpoint;

    if (response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true;
      try {
        if (!refreshPromise) {
          refreshPromise = useAuthStore
            .getState()
            .refreshAccessToken()
            .finally(() => {
              refreshPromise = null;
            });
        }
        const token = await refreshPromise;
        config.headers.Authorization = `Bearer ${token}`;
        return httpHelper(config);
      } catch (_) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // A failed refresh-token call is the normal, silent way we detect "no session
    // yet" on cold load (App.checkAuth) - not a user-facing error worth a toast.
    if (!isRefreshEndpoint) {
      const message = error.response?.data?.error?.message || error.message || 'Something went wrong';
      import('@/stores/uiStore').then(({ useUIStore }) => {
        useUIStore.getState().addToast({ type: 'error', message });
      });
    }

    return Promise.reject(error);
  }
);

export default httpHelper;
