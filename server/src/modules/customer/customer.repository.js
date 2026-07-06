import { Customer } from './models/Customer.model.js';

export const customerRepository = {
  findByUserId: async (userId) => {
    return await Customer.findOne({ userId });
  },

  create: async (customerData) => {
    return await Customer.create(customerData);
  },

  save: async (customer) => {
    return await customer.save();
  }
};
