import mongoose from 'mongoose';
import { baseSchemaOptions } from '../../../utils/baseSchemaOptions.js';

const voucherUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  count: { type: Number, default: 0 }
});

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Voucher code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: [1, 'Voucher value must be at least 1']
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  usedByUsers: [voucherUserSchema],
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, baseSchemaOptions);

export const Voucher = mongoose.models.Voucher || mongoose.model('Voucher', voucherSchema);
