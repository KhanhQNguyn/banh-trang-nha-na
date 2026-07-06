import { eventBus, EVENTS } from '../../utils/eventBus.js';
import { voucherService } from './voucher.service.js';

export const initVoucherEvents = () => {
  eventBus.on(EVENTS.ORDER_CANCELLED, async (order) => {
    try {
      if (order.voucherCode) {
        console.log(`🎟️ Releasing voucher usage: ${order.voucherCode} for user: ${order.userId || 'guest'}`);
        await voucherService.releaseVoucher(order.voucherCode, order.userId);
        console.log(`✅ Voucher ${order.voucherCode} usage decremented.`);
      }
    } catch (error) {
      console.error(`❌ Failed to release voucher usage: ${error.message}`);
    }
  });
};
