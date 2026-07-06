import { catalogService } from './catalog.service.js';

export const catalogInterfaces = {
  getProductById: async (id) => {
    return await catalogService.getProductById(id);
  },

  getVariantById: async (productId, variantId) => {
    return await catalogService.getVariantById(productId, variantId);
  },

  decrementStock: async (productId, variantId, quantity, session) => {
    return await catalogService.decrementStock(productId, variantId, quantity, session);
  },

  incrementStock: async (productId, variantId, quantity) => {
    return await catalogService.incrementStock(productId, variantId, quantity);
  },

  getProductSnapshot: async (productId, variantId) => {
    const product = await catalogService.getProductById(productId);
    if (!product) return null;

    const variant = product.variants.id(variantId);
    if (!variant) return null;

    return {
      productSnapshot: {
        productId: product._id,
        name: product.name,
        image: product.images.length > 0 ? product.images[0].url : '',
        slug: product.slug
      },
      variantSnapshot: {
        variantId: variant._id,
        sku: variant.sku || `${product.slug}-${variant._id}`,
        attributes: {
          size: variant.attributes?.size || '',
          flavor: variant.attributes?.flavor || ''
        }
      },
      // Determine the pricing snapshot
      price: product.promoPrice !== null ? product.promoPrice + variant.priceModifier : product.basePrice + variant.priceModifier
    };
  }
};
