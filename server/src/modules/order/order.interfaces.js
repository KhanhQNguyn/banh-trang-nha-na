import { orderService } from './order.service.js';

export const orderInterfaces = {
  getOrderCountToday: async () => {
    return await orderService.getOrderCountToday();
  },

  getRecentOrders: async (limit) => {
    return await orderService.getRecentOrders(limit);
  }
};
