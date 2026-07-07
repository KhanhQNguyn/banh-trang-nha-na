import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const findIndex = (items, productId, variantId) =>
  items.findIndex((i) => i.productId === productId && i.variantId === variantId);

// Clamp a requested quantity against available stock. A finite stock value caps
// the quantity (0 stock => 0, i.e. cannot add); a missing stock value is treated
// as unlimited.
const clampToStock = (quantity, stockQuantity) =>
  Number.isFinite(stockQuantity) ? Math.min(quantity, stockQuantity) : quantity;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) => {
        // Nothing to add for a sold-out variant.
        if (Number.isFinite(product.stockQuantity) && product.stockQuantity <= 0) {
          return;
        }

        const items = [...get().items];
        const idx = findIndex(items, product.productId, product.variantId);

        if (idx > -1) {
          const nextQuantity = items[idx].quantity + quantity;
          items[idx] = {
            ...items[idx],
            quantity: clampToStock(nextQuantity, product.stockQuantity),
          };
        } else {
          items.push({ ...product, quantity: clampToStock(quantity, product.stockQuantity) });
        }

        set({ items, isOpen: true });
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        const items = [...get().items];
        const idx = findIndex(items, productId, variantId);
        if (idx === -1) return;

        items[idx] = {
          ...items[idx],
          quantity: clampToStock(quantity, items[idx].stockQuantity),
        };
        set({ items });
      },

      incrementItem: (productId, variantId) => {
        const item = get().items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );
        if (item) get().updateQuantity(productId, variantId, item.quantity + 1);
      },

      decrementItem: (productId, variantId) => {
        const item = get().items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );
        if (item) get().updateQuantity(productId, variantId, item.quantity - 1);
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    {
      name: 'btnn-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
