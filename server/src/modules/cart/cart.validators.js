import { AppError } from '../../utils/AppError.js';

export const cartValidators = {
  validateAddToCart: (data) => {
    const { productId, variantId, quantity } = data;
    const errors = {};

    if (!productId) errors.productId = 'Product ID is required';
    if (!variantId) errors.variantId = 'Variant ID is required';
    
    if (quantity === undefined) {
      errors.quantity = 'Quantity is required';
    } else if (typeof quantity !== 'number' || quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateUpdateQuantity: (data) => {
    const { quantity } = data;
    const errors = {};

    if (quantity === undefined) {
      errors.quantity = 'Quantity is required';
    } else if (typeof quantity !== 'number' || quantity < 1) {
      errors.quantity = 'Quantity must be at least 1';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
