import { EventEmitter } from 'events';

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();

// Event names constants
export const EVENTS = {
  USER_REGISTERED: 'user.registered',
  ORDER_PLACED: 'order.placed',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_SHIPPING: 'order.shipping',
  ORDER_COMPLETED: 'order.completed',
  ORDER_CANCELLED: 'order.cancelled',
  STOCK_LOW: 'stock.low'
};
