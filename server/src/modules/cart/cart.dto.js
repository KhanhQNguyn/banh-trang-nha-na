export const cartDto = {
  cartResponse: (cart) => {
    // If cart is empty or has no items
    if (!cart || !cart.items) {
      return { items: [], totalItems: 0, totalAmount: 0 };
    }

    let totalItems = 0;
    let totalAmount = 0;

    const items = cart.items.map(item => {
      const product = item.productId;
      if (!product) return null;

      const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());
      if (!variant) return null;

      const price = product.promoPrice !== null ? product.promoPrice + variant.priceModifier : product.basePrice + variant.priceModifier;
      const subtotal = price * item.quantity;
      
      totalItems += item.quantity;
      totalAmount += subtotal;

      return {
        id: item._id.toString(),
        productId: product._id.toString(),
        productName: product.name,
        productSlug: product.slug,
        image: product.images.length > 0 ? product.images[0].url : '',
        variantId: variant._id.toString(),
        attributes: {
          size: variant.attributes?.size || '',
          flavor: variant.attributes?.flavor || ''
        },
        unitPrice: price,
        quantity: item.quantity,
        subtotal
      };
    }).filter(Boolean);

    return {
      items,
      totalItems,
      totalAmount
    };
  }
};
