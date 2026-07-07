import mongoose from 'mongoose';
import { orderRepository } from './order.repository.js';
import { catalogInterfaces } from '../catalog/catalog.interfaces.js';
import { voucherInterfaces } from '../voucher/voucher.interfaces.js';
import { generateOrderNumber } from '../../utils/generateOrderNumber.js';
import { AppError } from '../../utils/AppError.js';
import { eventBus, EVENTS } from '../../utils/eventBus.js';

export const orderService = {
  getOrderById: async (id) => {
    return await orderRepository.findById(id);
  },

  placeOrder: async (orderData) => {
    const { items: requestItems, voucherCode, paymentMethod, customerInfo, note } = orderData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const customerSnapshot = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email || '',
        address: customerInfo.address
      };

      // Resolve items and compute subtotal
      let subtotal = 0;
      const orderItems = [];

      for (const reqItem of requestItems) {
        const { productId, variantId, quantity } = reqItem;

        const snap = await catalogInterfaces.getProductSnapshot(productId, variantId);
        if (!snap) {
          throw new AppError(404, 'Product variant not found or deactivated');
        }

        const itemSubtotal = snap.price * quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          productSnapshot: snap.productSnapshot,
          variantSnapshot: snap.variantSnapshot,
          unitPrice: snap.price,
          quantity,
          subtotal: itemSubtotal
        });

        await catalogInterfaces.decrementStock(productId, variantId, quantity, session);
      }

      // Apply voucher if present
      let discountAmount = 0;
      if (voucherCode) {
        const voucherValidation = await voucherInterfaces.validateVoucher(voucherCode, subtotal, null);
        discountAmount = voucherValidation.discountAmount;
        await voucherInterfaces.consumeVoucher(voucherCode, null, session);
      }

      const total = subtotal - discountAmount;
      const orderNumber = await generateOrderNumber();

      const newOrder = await orderRepository.create({
        orderNumber,
        userId: null,
        customerSnapshot,
        items: orderItems,
        subtotal,
        discountAmount,
        voucherCode: voucherCode || null,
        total,
        status: 'pending_confirmation',
        statusHistory: [{ status: 'pending_confirmation' }],
        note,
        paymentMethod
      }, session);

      await session.commitTransaction();
      session.endSession();

      eventBus.emit(EVENTS.ORDER_PLACED, newOrder);

      return newOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  guestLookup: async (orderNumber, phone) => {
    const order = await orderRepository.findOne({ orderNumber, 'customerSnapshot.phone': phone });
    if (!order) {
      throw new AppError(404, 'Order not found with provided number and phone');
    }
    return order;
  }
};
