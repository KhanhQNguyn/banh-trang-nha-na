import { customerService } from './customer.service.js';

export const customerInterfaces = {
  getCustomerByUserId: async (userId) => {
    return await customerService.getCustomerByUserId(userId);
  },
  getCustomerSnapshot: async (userId) => {
    const customer = await customerService.getCustomerByUserId(userId);
    if (!customer) return null;
    
    // Find default address or first address
    const defaultAddress = customer.addresses.find(addr => addr.isDefault) || customer.addresses[0];
    
    return {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || '',
      address: defaultAddress ? defaultAddress.fullAddress : ''
    };
  }
};
