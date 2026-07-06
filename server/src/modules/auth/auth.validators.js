import { AppError } from '../../utils/AppError.js';

export const authValidators = {
  validateRegister: (data) => {
    const { email, password, fullName, phone } = data;
    const errors = {};

    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    if (!fullName) errors.fullName = 'Full name is required';
    if (!phone) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateLogin: (data) => {
    const { email, password } = data;
    const errors = {};

    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
