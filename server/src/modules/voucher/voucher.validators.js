import { AppError } from '../../utils/AppError.js';

export const voucherValidators = {
  validateCreateVoucher: (data) => {
    const { code, type, value, validFrom, validUntil } = data;
    const errors = {};

    if (!code || !code.trim()) errors.code = 'Voucher code is required';
    if (!type || !['percentage', 'fixed'].includes(type)) {
      errors.type = 'Voucher type must be percentage or fixed';
    }
    
    if (value === undefined) {
      errors.value = 'Voucher value is required';
    } else if (typeof value !== 'number' || value <= 0) {
      errors.value = 'Voucher value must be a positive number';
    } else if (type === 'percentage' && value > 100) {
      errors.value = 'Percentage discount cannot exceed 100%';
    }

    if (!validFrom) errors.validFrom = 'Valid start date is required';
    if (!validUntil) errors.validUntil = 'Valid expiry date is required';
    
    if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
      errors.validUntil = 'Expiry date must be after the start date';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateValidateVoucher: (data) => {
    const { code, orderTotal } = data;
    const errors = {};

    if (!code) errors.code = 'Voucher code is required';
    if (orderTotal === undefined || typeof orderTotal !== 'number' || orderTotal < 0) {
      errors.orderTotal = 'Order total must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
