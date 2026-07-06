import { eventBus, EVENTS } from '../../utils/eventBus.js';

export const initOrderEvents = () => {
  eventBus.on(EVENTS.ORDER_PLACED, (order) => {
    console.log(`🎉 NEW ORDER PLACED: ${order.orderNumber} - Total: ${order.total}đ`);
  });

  eventBus.on(EVENTS.ORDER_CONFIRMED, (order) => {
    console.log(`👍 ORDER CONFIRMED: ${order.orderNumber}`);
  });

  eventBus.on(EVENTS.ORDER_SHIPPING, (order) => {
    console.log(`🚚 ORDER SHIPPING: ${order.orderNumber}`);
  });

  eventBus.on(EVENTS.ORDER_COMPLETED, (order) => {
    console.log(`✅ ORDER COMPLETED: ${order.orderNumber}`);
  });
};
