import { AppError } from '../../utils/AppError.js';

export const authValidators = {
  validateLogin: (data) => {
    const { email, password } = data;
    const errors = {};

    if (!email || !email.trim()) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  }
};
