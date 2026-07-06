import mongoose from 'mongoose';
import { baseSchemaOptions } from '../../../utils/baseSchemaOptions.js';

const orderItemSchema = new mongoose.Schema({
  productSnapshot: {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    image: { type: String },
    slug: { type: String, required: true }
  },
  variantSnapshot: {
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    sku: { type: String },
    attributes: {
      size: { type: String },
      flavor: { type: String }
    }
  },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true }
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending_confirmation', 'confirmed', 'shipping', 'completed', 'cancelled'],
    required: true
  },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Nullable for guest checkouts
  },
  customerSnapshot: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  voucherCode: { type: String },
  total: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['pending_confirmation', 'confirmed', 'shipping', 'completed', 'cancelled'],
    default: 'pending_confirmation'
  },
  statusHistory: [statusHistorySchema],
  note: { type: String },
  paymentMethod: {
    type: String,
    enum: ['cod', 'bank_transfer'],
    default: 'cod'
  },
  cancelReason: { type: String }
}, baseSchemaOptions);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
