import { cartService } from './cart.service.js';

export const cartInterfaces = {
  getCartForUser: async (userId) => {
    return await cartService.getCart(userId);
  },
  clearCart: async (userId) => {
    return await cartService.clearCart(userId);
  }
};
