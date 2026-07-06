export const voucherDto = {
  voucherResponse: (voucher) => {
    return {
      id: voucher.id || voucher._id.toString(),
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      minOrderValue: voucher.minOrderValue,
      maxDiscount: voucher.maxDiscount,
      usageLimit: voucher.usageLimit,
      usedCount: voucher.usedCount,
      perUserLimit: voucher.perUserLimit,
      validFrom: voucher.validFrom,
      validUntil: voucher.validUntil,
      isActive: voucher.isActive
    };
  },

  voucherListResponse: (vouchers) => {
    return vouchers.map(voucherDto.voucherResponse);
  }
};
