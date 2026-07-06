import { create } from 'zustand';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const res = await httpHelper.post(API.AUTH.LOGIN, credentials);
    const user = res.data.data;
    if (user.role !== 'admin') {
      await httpHelper.post(API.AUTH.LOGOUT);
      throw new Error('Access denied. Admin accounts only.');
    }
    set({ user, isAuthenticated: true });
    return res.data;
  },

  logout: async () => {
    try { await httpHelper.post(API.AUTH.LOGOUT); } catch (_) {}
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      await httpHelper.post(API.AUTH.REFRESH);
      set({ isAuthenticated: true, isLoading: false });
    } catch (_) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
