import { create } from 'zustand';

let toastIdCounter = 0;

export const useUIStore = create((set, get) => ({
  toasts: [],
  globalLoading: false,

  addToast: ({ type = 'info', message, duration = 4000 }) => {
    const id = ++toastIdCounter;
    set({ toasts: [...get().toasts, { id, type, message }] });
    setTimeout(() => get().removeToast(id), duration);
    return id;
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },
}));
