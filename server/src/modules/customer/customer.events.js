import { eventBus, EVENTS } from '../../utils/eventBus.js';
import { customerService } from './customer.service.js';

export const initCustomerEvents = () => {
  eventBus.on(EVENTS.USER_REGISTERED, async (payload) => {
    try {
      const { userId, fullName, phone, email } = payload;
      await customerService.createProfile({ userId, fullName, phone, email });
      console.log(`👤 Customer profile auto-created for userId: ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to auto-create customer profile: ${error.message}`);
    }
  });
};
