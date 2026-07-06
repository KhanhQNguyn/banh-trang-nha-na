import { AppError } from '../../utils/AppError.js';

export const catalogValidators = {
  validateCreateProduct: (data) => {
    const { name, description, categoryId, basePrice } = data;
    const errors = {};

    if (!name) errors.name = 'Product name is required';
    if (!description) errors.description = 'Product description is required';
    if (!categoryId) errors.categoryId = 'Product category is required';
    
    if (basePrice === undefined) {
      errors.basePrice = 'Base price is required';
    } else if (typeof basePrice !== 'number' || basePrice < 0) {
      errors.basePrice = 'Base price must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateUpdateProduct: (data) => {
    const { basePrice, promoPrice } = data;
    const errors = {};

    if (basePrice !== undefined && (typeof basePrice !== 'number' || basePrice < 0)) {
      errors.basePrice = 'Base price must be a positive number';
    }
    if (promoPrice !== undefined && promoPrice !== null && (typeof promoPrice !== 'number' || promoPrice < 0)) {
      errors.promoPrice = 'Promo price must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateCreateCategory: (data) => {
    const { name } = data;
    const errors = {};

    if (!name) errors.name = 'Category name is required';

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
