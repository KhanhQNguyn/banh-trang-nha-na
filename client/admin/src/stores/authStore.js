import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      login: async ({ email, password }) => {
        const res = await httpHelper.post(API.AUTH.LOGIN, { email, password });
        const { user, accessToken } = res.data.data;

        if (user.role !== 'admin') {
          await httpHelper.post(API.AUTH.LOGOUT);
          throw new Error('Tài khoản này không có quyền quản trị.');
        }

        set({ user, accessToken, isAuthenticated: true });
        return user;
      },

      logout: async () => {
        try {
          await httpHelper.post(API.AUTH.LOGOUT);
        } catch (_) {
          // Ignore errors during logout
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      // Exchanges the httpOnly refresh cookie for a fresh access token. Used both
      // on initial app load (the in-memory access token doesn't survive a reload)
      // and by the http client to recover from a 401 mid-session.
      refreshAccessToken: async () => {
        const res = await httpHelper.post(API.AUTH.REFRESH);
        const { accessToken } = res.data.data;
        set({ accessToken, isAuthenticated: true });
        return accessToken;
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          await get().refreshAccessToken();
          set({ isLoading: false });
        } catch (_) {
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'btnn-admin-auth',
      // Only the display-only user profile is persisted. The access token is
      // memory-only and re-derived from the httpOnly refresh cookie on load, so a
      // stolen localStorage dump alone can't grant a session.
      partialize: (state) => ({ user: state.user }),
    }
  )
);
