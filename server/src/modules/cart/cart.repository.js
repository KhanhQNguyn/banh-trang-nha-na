import { Cart } from './models/Cart.model.js';

export const cartRepository = {
  findByUserId: async (userId, populate = false) => {
    let query = Cart.findOne({ userId });
    if (populate) {
      query = query.populate('items.productId');
    }
    return await query;
  },

  create: async (cartData) => {
    return await Cart.create(cartData);
  },

  save: async (cart) => {
    return await cart.save();
  },

  clear: async (userId) => {
    return await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
};
