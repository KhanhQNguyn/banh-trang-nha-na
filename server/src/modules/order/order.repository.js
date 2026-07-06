import { Order } from './models/Order.model.js';

export const orderRepository = {
  findById: async (id) => {
    return await Order.findById(id);
  },

  findOne: async (filter = {}) => {
    return await Order.findOne(filter);
  },

  find: async (filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) => {
    return await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },

  count: async (filter = {}) => {
    return await Order.countDocuments(filter);
  },

  create: async (orderData, session = null) => {
    const options = session ? { session } : {};
    const [order] = await Order.create([orderData], options);
    return order;
  },

  save: async (order) => {
    return await order.save();
  }
};
