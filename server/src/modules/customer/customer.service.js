import { customerRepository } from './customer.repository.js';
import { AppError } from '../../utils/AppError.js';

export const customerService = {
  getCustomerByUserId: async (userId) => {
    return await customerRepository.findByUserId(userId);
  },

  createProfile: async (profileData) => {
    const { userId, fullName, phone, email } = profileData;
    return await customerRepository.create({
      userId,
      fullName,
      phone,
      email,
      addresses: []
    });
  },

  updateProfile: async (userId, updateData) => {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) {
      throw new AppError(404, 'Customer profile not found');
    }

    if (updateData.fullName) customer.fullName = updateData.fullName;
    if (updateData.phone) customer.phone = updateData.phone;
    if (updateData.dateOfBirth) customer.dateOfBirth = updateData.dateOfBirth;

    return await customerRepository.save(customer);
  },

  addAddress: async (userId, addressData) => {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) {
      throw new AppError(404, 'Customer profile not found');
    }

    const { label, fullAddress, ward, district, city, isDefault } = addressData;

    // If new address is set to default, unset other defaults
    if (isDefault) {
      customer.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // If it's the first address, make it default automatically
    const isFirstAddress = customer.addresses.length === 0;

    customer.addresses.push({
      label: label || 'home',
      fullAddress,
      ward,
      district,
      city,
      isDefault: isFirstAddress ? true : !!isDefault
    });

    return await customerRepository.save(customer);
  }
};
