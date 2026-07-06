import { AppError } from '../../utils/AppError.js';

export const orderValidators = {
  validateCreateOrder: (data, isGuest = false) => {
    const { items, paymentMethod, customerInfo } = data;
    const errors = {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.items = 'Order must contain at least one item';
    } else {
      items.forEach((item, idx) => {
        if (!item.productId) errors[`items[${idx}].productId`] = 'Product ID is required';
        if (!item.variantId) errors[`items[${idx}].variantId`] = 'Variant ID is required';
        if (!item.quantity || item.quantity < 1) errors[`items[${idx}].quantity`] = 'Quantity must be at least 1';
      });
    }

    if (!paymentMethod || !['cod', 'bank_transfer'].includes(paymentMethod)) {
      errors.paymentMethod = 'Invalid or missing payment method (cod or bank_transfer)';
    }

    // Customer info validation (mandatory for guest, optional for auth but recommended)
    if (isGuest || customerInfo) {
      if (!customerInfo) {
        errors.customerInfo = 'Customer contact information is required';
      } else {
        const { fullName, phone, address } = customerInfo;
        if (!fullName || !fullName.trim()) errors.fullName = 'Full name is required';
        if (!phone || !phone.trim()) errors.phone = 'Phone number is required';
        if (!address || !address.trim()) errors.address = 'Delivery address is required';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new AppError(400, 'Validation failed', errors);
    }
  },

  validateOrderTransition: (currentState, targetState, userRole) => {
    const validTransitions = {
      pending_confirmation: ['confirmed', 'cancelled'],
      confirmed: ['shipping', 'cancelled'],
      shipping: ['completed', 'cancelled'],
      completed: [], // Terminal state
      cancelled: []  // Terminal state
    };

    if (!validTransitions[currentState]) {
      throw new AppError(400, `Invalid order status: ${currentState}`);
    }

    if (!validTransitions[currentState].includes(targetState)) {
      throw new AppError(400, `Cannot transition order status from '${currentState}' to '${targetState}'`);
    }

    // Role-based restrictions
    if (userRole !== 'admin') {
      // Customers can ONLY cancel their order if it is still pending confirmation
      if (targetState === 'cancelled') {
        if (currentState !== 'pending_confirmation') {
          throw new AppError(403, 'Cannot cancel order after confirmation. Please contact support.');
        }
      } else {
        throw new AppError(403, 'Only administrators can perform status transitions');
      }
    }
  }
};
