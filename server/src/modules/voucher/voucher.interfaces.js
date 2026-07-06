import { voucherService } from './voucher.service.js';

export const voucherInterfaces = {
  validateVoucher: async (code, orderTotal, userId) => {
    return await voucherService.validateVoucher(code, orderTotal, userId);
  },

  consumeVoucher: async (code, userId, session) => {
    return await voucherService.consumeVoucher(code, userId, session);
  },

  releaseVoucher: async (code, userId) => {
    return await voucherService.releaseVoucher(code, userId);
  }
};
