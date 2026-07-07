import { eventBus, EVENTS } from '../../utils/eventBus.js';
import { catalogService } from './catalog.service.js';

export const initCatalogEvents = () => {
  eventBus.on(EVENTS.ORDER_CANCELLED, async (order) => {
    try {
      console.log(`Order ${order.orderNumber} cancelled. Restocking items...`);
      for (const item of order.items) {
        const { productId } = item.productSnapshot;
        const { variantId } = item.variantSnapshot;
        const { quantity } = item;

        await catalogService.incrementStock(productId, variantId, quantity);
        console.log(`Restocked variant ${variantId}: +${quantity}`);
      }
    } catch (error) {
      console.error(`Failed to restock items for cancelled order: ${error.message}`);
    }
  });

  eventBus.on(EVENTS.STOCK_LOW, (data) => {
    console.log(`LOW STOCK WARNING: Product ${data.productId}, Variant ${data.variantId} (SKU: ${data.sku}) is running low! Current stock: ${data.stockQuantity}`);
  });
};
