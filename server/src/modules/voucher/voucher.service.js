import { voucherRepository } from './voucher.repository.js';
import { AppError } from '../../utils/AppError.js';
import { Voucher } from './models/Voucher.model.js'; // imported only for query support in transactions if needed, or update via repository

export const voucherService = {
  getVouchers: async (includeInactive = false) => {
    const filter = includeInactive ? {} : { isActive: true };
    return await voucherRepository.find(filter);
  },

  createVoucher: async (voucherData) => {
    const existing = await voucherRepository.findByCode(voucherData.code);
    if (existing) {
      throw new AppError(400, 'Voucher code already exists');
    }
    return await voucherRepository.create(voucherData);
  },

  updateVoucher: async (id, updateData) => {
    const voucher = await voucherRepository.findById(id);
    if (!voucher) throw new AppError(404, 'Voucher not found');

    Object.assign(voucher, updateData);
    return await voucherRepository.save(voucher);
  },

  deleteVoucher: async (id) => {
    return await voucherRepository.delete(id);
  },

  validateVoucher: async (code, orderTotal, userId = null) => {
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) {
      throw new AppError(404, 'Voucher not found');
    }

    if (!voucher.isActive) {
      throw new AppError(400, 'Voucher is inactive');
    }

    const now = new Date();
    if (now < new Date(voucher.validFrom)) {
      throw new AppError(400, 'Voucher is not active yet');
    }
    if (now > new Date(voucher.validUntil)) {
      throw new AppError(400, 'Voucher has expired');
    }

    if (orderTotal < voucher.minOrderValue) {
      throw new AppError(400, `Voucher requires a minimum order value of ${voucher.minOrderValue}đ`);
    }

    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      throw new AppError(400, 'Voucher usage limit reached');
    }

    if (userId) {
      const userRecord = voucher.usedByUsers.find(
        record => record.userId.toString() === userId.toString()
      );
      if (userRecord && userRecord.count >= voucher.perUserLimit) {
        throw new AppError(400, 'You have reached the usage limit for this voucher');
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (voucher.type === 'percentage') {
      discountAmount = (orderTotal * voucher.value) / 100;
      if (voucher.maxDiscount !== null && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'fixed') {
      discountAmount = voucher.value;
    }

    // Discount cannot exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      voucherId: voucher._id,
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      discountAmount
    };
  },

  consumeVoucher: async (code, userId, session = null) => {
    const options = session ? { session } : {};
    
    // We increment usedCount and add/increment userId count atomically
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) throw new AppError(404, 'Voucher not found');

    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      throw new AppError(400, 'Voucher usage limit reached');
    }

    // Increment usedCount
    voucher.usedCount += 1;

    // Track user usage
    if (userId) {
      const userRecord = voucher.usedByUsers.find(
        record => record.userId.toString() === userId.toString()
      );
      if (userRecord) {
        if (userRecord.count >= voucher.perUserLimit) {
          throw new AppError(400, 'Usage limit per user reached');
        }
        userRecord.count += 1;
      } else {
        voucher.usedByUsers.push({ userId, count: 1 });
      }
    }

    const saved = await Voucher.findOneAndUpdate(
      { _id: voucher._id },
      {
        $set: {
          usedCount: voucher.usedCount,
          usedByUsers: voucher.usedByUsers
        }
      },
      { new: true, ...options }
    );

    return saved;
  },

  releaseVoucher: async (code, userId) => {
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) return null;

    if (voucher.usedCount > 0) {
      voucher.usedCount -= 1;
    }

    if (userId) {
      const userRecord = voucher.usedByUsers.find(
        record => record.userId.toString() === userId.toString()
      );
      if (userRecord && userRecord.count > 0) {
        userRecord.count -= 1;
        if (userRecord.count === 0) {
          voucher.usedByUsers.pull({ _id: userRecord._id });
        }
      }
    }

    await voucherRepository.save(voucher);
    return voucher;
  }
};
