import { cartRepository } from './cart.repository.js';
import { catalogInterfaces } from '../catalog/catalog.interfaces.js';
import { AppError } from '../../utils/AppError.js';

export const cartService = {
  getCart: async (userId) => {
    let cart = await cartRepository.findByUserId(userId, true);
    if (!cart) {
      cart = await cartRepository.create({ userId, items: [] });
    }
    return cart;
  },

  addItem: async (userId, itemData) => {
    const { productId, variantId, quantity } = itemData;

    // Validate product and variant using catalog cross-module interfaces
    const product = await catalogInterfaces.getProductById(productId);
    if (!product || !product.isActive) {
      throw new AppError(404, 'Product not found or unavailable');
    }

    const variant = await catalogInterfaces.getVariantById(productId, variantId);
    if (!variant || !variant.isActive) {
      throw new AppError(404, 'Variant not found or unavailable');
    }

    // Validate stock levels
    if (variant.stockQuantity < quantity) {
      throw new AppError(400, `Insufficient stock. Only ${variant.stockQuantity} left.`);
    }

    let cart = await cartRepository.findByUserId(userId, false);
    if (!cart) {
      cart = await cartRepository.create({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString() && item.variantId.toString() === variantId.toString()
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (variant.stockQuantity < newQuantity) {
        throw new AppError(400, `Insufficient stock. Cannot add more items. Only ${variant.stockQuantity} in stock.`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    await cartRepository.save(cart);
    return await cartRepository.findByUserId(userId, true);
  },

  updateQuantity: async (userId, cartItemId, quantity) => {
    const cart = await cartRepository.findByUserId(userId, false);
    if (!cart) throw new AppError(404, 'Cart not found');

    const item = cart.items.id(cartItemId);
    if (!item) throw new AppError(404, 'Cart item not found');

    // Validate stock
    const variant = await catalogInterfaces.getVariantById(item.productId, item.variantId);
    if (!variant || !variant.isActive) {
      throw new AppError(404, 'Variant no longer available');
    }

    if (variant.stockQuantity < quantity) {
      throw new AppError(400, `Insufficient stock. Only ${variant.stockQuantity} left.`);
    }

    item.quantity = quantity;
    await cartRepository.save(cart);
    
    return await cartRepository.findByUserId(userId, true);
  },

  removeItem: async (userId, cartItemId) => {
    const cart = await cartRepository.findByUserId(userId, false);
    if (!cart) throw new AppError(404, 'Cart not found');

    cart.items.pull(cartItemId);
    await cartRepository.save(cart);
    
    return await cartRepository.findByUserId(userId, true);
  },

  clearCart: async (userId) => {
    return await cartRepository.clear(userId);
  }
};
