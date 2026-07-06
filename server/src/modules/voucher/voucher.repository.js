import { Voucher } from './models/Voucher.model.js';

export const voucherRepository = {
  findByCode: async (code) => {
    return await Voucher.findOne({ code: code.toUpperCase() });
  },

  findById: async (id) => {
    return await Voucher.findById(id);
  },

  find: async (filter = {}) => {
    return await Voucher.find(filter).sort({ createdAt: -1 });
  },

  create: async (voucherData) => {
    return await Voucher.create(voucherData);
  },

  save: async (voucher) => {
    return await voucher.save();
  },

  delete: async (id) => {
    return await Voucher.findByIdAndDelete(id);
  }
};
