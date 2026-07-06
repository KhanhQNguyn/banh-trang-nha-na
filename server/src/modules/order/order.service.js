import mongoose from 'mongoose';
import { orderRepository } from './order.repository.js';
import { catalogInterfaces } from '../catalog/catalog.interfaces.js';
import { voucherInterfaces } from '../voucher/voucher.interfaces.js';
import { customerInterfaces } from '../customer/customer.interfaces.js';
import { cartInterfaces } from '../cart/cart.interfaces.js';
import { generateOrderNumber } from '../../utils/generateOrderNumber.js';
import { AppError } from '../../utils/AppError.js';
import { eventBus, EVENTS } from '../../utils/eventBus.js';
import { orderValidators } from './order.validators.js';

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
    return await orderRepository.count({
      createdAt: { $gte: startOfToday }
    });
  },

  getRecentOrders: async (limit = 5) => {
    return await orderRepository.find({}, 0, limit);
  },

  placeOrder: async (userId, orderData) => {
    const { items: requestItems, voucherCode, paymentMethod, customerInfo, note } = orderData;

    // Start MongoDB session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let finalCustomerSnapshot = {};

      if (userId) {
        // Resolve customer info snapshot from customer profile
        const profileSnapshot = await customerInterfaces.getCustomerSnapshot(userId);
        if (profileSnapshot) {
          finalCustomerSnapshot = {
            fullName: customerInfo?.fullName || profileSnapshot.fullName,
            phone: customerInfo?.phone || profileSnapshot.phone,
            email: customerInfo?.email || profileSnapshot.email,
            address: customerInfo?.address || profileSnapshot.address
          };
        } else {
          // Fallback to customerInfo fields
          finalCustomerSnapshot = {
            fullName: customerInfo.fullName,
            phone: customerInfo.phone,
            email: customerInfo.email || '',
            address: customerInfo.address
          };
        }
      } else {
        // Guest checkout
        finalCustomerSnapshot = {
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          email: customerInfo.email || '',
          address: customerInfo.address
        };
      }

      // Resolve items and compute subtotal
      let subtotal = 0;
      const orderItems = [];

      for (const reqItem of requestItems) {
        const { productId, variantId, quantity } = reqItem;
        
        // Fetch snapshot and price
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

        // Atomic stock check and decrement
        await catalogInterfaces.decrementStock(productId, variantId, quantity, session);
      }

      // Apply voucher if present
      let discountAmount = 0;
      if (voucherCode) {
        const voucherValidation = await voucherInterfaces.validateVoucher(voucherCode, subtotal, userId);
        discountAmount = voucherValidation.discountAmount;
        
        // Consume voucher usage limits
        await voucherInterfaces.consumeVoucher(voucherCode, userId, session);
      }

      const total = subtotal - discountAmount;
      const orderNumber = await generateOrderNumber();

      // Create Order
      const newOrder = await orderRepository.create({
        orderNumber,
        userId,
        customerSnapshot: finalCustomerSnapshot,
        items: orderItems,
        subtotal,
        discountAmount,
        voucherCode: voucherCode || null,
        total,
        status: 'pending_confirmation',
        statusHistory: [{ status: 'pending_confirmation', changedBy: userId }],
        note,
        paymentMethod
      }, session);

      // Clear Cart if user checkout from cart
      if (userId) {
        await cartInterfaces.clearCart(userId);
      }

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Emit order placed event
      eventBus.emit(EVENTS.ORDER_PLACED, newOrder);

      return newOrder;
    } catch (error) {
      // Abort transaction on any error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  transitionStatus: async (orderId, targetStatus, changedByUserId, userRole, cancelReason = null) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError(404, 'Order not found');

    // Run status transition validator
    orderValidators.validateOrderTransition(order.status, targetStatus, userRole);

    order.status = targetStatus;
    order.statusHistory.push({
      status: targetStatus,
      changedBy: changedByUserId
    });

    if (targetStatus === 'cancelled') {
      order.cancelReason = cancelReason || 'Cancelled by admin';
    }

    const updated = await orderRepository.save(order);

    // Emit event for cancelled order to restock and release vouchers
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

  guestLookup: async (orderNumber, phone) => {
    const order = await orderRepository.findOne({ orderNumber, 'customerSnapshot.phone': phone });
    if (!order) {
      throw new AppError(404, 'Order not found with provided number and phone');
    }
    return order;
  }
};
