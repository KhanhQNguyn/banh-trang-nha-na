import { create } from 'zustand';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const res = await httpHelper.post(API.AUTH.LOGIN, credentials);
    set({ user: res.data.data, isAuthenticated: true });
    return res.data;
  },

  register: async (data) => {
    const res = await httpHelper.post(API.AUTH.REGISTER, data);
    set({ user: res.data.data, isAuthenticated: true });
    return res.data;
  },

  logout: async () => {
    try {
      await httpHelper.post(API.AUTH.LOGOUT);
    } catch (_) {
      // Ignore errors during logout
    }
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      await httpHelper.post(API.AUTH.REFRESH);
      // If refresh succeeded, fetch user profile info
      const res = await httpHelper.get(API.CUSTOMERS.ME);
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch (_) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
