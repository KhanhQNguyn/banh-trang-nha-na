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

  queryOrders: async (filters = {}, pagination = {}) => {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const orders = await orderRepository.find(filters, skip, limit);
    const total = await orderRepository.count(filters);
    return { orders, total };
  },

  getOrderCountToday: async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return await orderRepository.count({ createdAt: { $gte: startOfToday } });
  },

  getRecentOrders: async (limit = 5) => {
    return await orderRepository.find({}, 0, limit);
  },

  transitionStatus: async (orderId, targetStatus, changedByAdminId, cancelReason = null) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError(404, 'Order not found');

    const { orderValidators } = await import('./order.validators.js');
    orderValidators.validateOrderTransition(order.status, targetStatus, 'admin');

    order.status = targetStatus;
    order.statusHistory.push({ status: targetStatus, changedBy: changedByAdminId });

    if (targetStatus === 'cancelled') {
      order.cancelReason = cancelReason || 'Cancelled by admin';
    }

    const updated = await orderRepository.save(order);

    if (targetStatus === 'cancelled') {
      eventBus.emit(EVENTS.ORDER_CANCELLED, updated);
    } else if (targetStatus === 'confirmed') {
      eventBus.emit(EVENTS.ORDER_CONFIRMED, updated);
    } else if (targetStatus === 'shipping') {
      eventBus.emit(EVENTS.ORDER_SHIPPING, updated);
    } else if (targetStatus === 'completed') {
      eventBus.emit(EVENTS.ORDER_COMPLETED, updated);
    }

    return updated;
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
