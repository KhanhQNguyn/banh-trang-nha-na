import { AppError } from '../../utils/AppError.js';

export const customerValidators = {
  validateUpdateProfile: (data) => {
    const { fullName, phone } = data;
    const errors = {};

    if (fullName !== undefined && !fullName.trim()) {
      errors.fullName = 'Full name cannot be empty';
    }
    if (phone !== undefined && !phone.trim()) {
      errors.phone = 'Phone number cannot be empty';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateAddAddress: (data) => {
    const { label, fullAddress } = data;
    const errors = {};

    if (!fullAddress) errors.fullAddress = 'Address details are required';
    if (label && !['home', 'work', 'other'].includes(label)) {
      errors.label = 'Invalid address label';
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
