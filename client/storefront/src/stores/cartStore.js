import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId, variantId, quantity, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isLoading: true });
          const res = await httpHelper.post(API.CART.ADD_ITEM, { productId, variantId, quantity });
          set({ items: res.data.data.items, isLoading: false });
        } else {
          // Guest: add to local state
          const items = [...get().items];
          const idx = items.findIndex(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (idx > -1) {
            items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
          } else {
            items.push({ productId, variantId, quantity, addedAt: new Date().toISOString() });
          }
          set({ items });
        }
      },

      removeItem: async (itemId, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isLoading: true });
          const res = await httpHelper.delete(API.CART.REMOVE_ITEM(itemId));
          set({ items: res.data.data.items, isLoading: false });
        } else {
          set({ items: get().items.filter((_, i) => i !== itemId) });
        }
      },

      updateQuantity: async (itemId, quantity, isAuthenticated) => {
        if (isAuthenticated) {
          set({ isLoading: true });
          const res = await httpHelper.patch(API.CART.UPDATE_ITEM(itemId), { quantity });
          set({ items: res.data.data.items, isLoading: false });
        } else {
          const items = [...get().items];
          if (items[itemId]) {
            items[itemId] = { ...items[itemId], quantity };
          }
          set({ items });
        }
      },

      clearCart: async (isAuthenticated) => {
        if (isAuthenticated) {
          await httpHelper.delete(API.CART.CLEAR);
        }
        set({ items: [] });
      },

      syncWithServer: async () => {
        try {
          set({ isLoading: true });
          const res = await httpHelper.get(API.CART.GET);
          set({ items: res.data.data.items, isLoading: false });
        } catch (_) {
          set({ isLoading: false });
        }
      },

      mergeGuestCart: async () => {
        const guestItems = get().items;
        if (guestItems.length === 0) return;

        // Add each guest item to the server cart
        for (const item of guestItems) {
          try {
            await httpHelper.post(API.CART.ADD_ITEM, {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            });
          } catch (_) {
            // Skip items that fail (e.g., out of stock)
          }
        }

        // Sync from server to get the merged result
        await get().syncWithServer();
      },
    }),
    {
      name: 'btnn-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
