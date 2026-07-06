export const customerDto = {
  customerResponse: (customer) => {
    return {
      id: customer.id || customer._id.toString(),
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email,
      dateOfBirth: customer.dateOfBirth,
      addresses: customer.addresses.map(addr => ({
        id: addr.id || addr._id.toString(),
        label: addr.label,
        fullAddress: addr.fullAddress,
        ward: addr.ward,
        district: addr.district,
        city: addr.city,
        isDefault: addr.isDefault
      }))
    };
  }
};
