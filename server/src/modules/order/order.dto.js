export const orderDto = {
  orderResponse: (order) => {
    return {
      id: order.id || order._id.toString(),
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerSnapshot: {
        fullName: order.customerSnapshot.fullName,
        phone: order.customerSnapshot.phone,
        email: order.customerSnapshot.email,
        address: order.customerSnapshot.address
      },
      items: order.items.map(item => ({
        id: item.id || item._id.toString(),
        product: {
          productId: item.productSnapshot.productId.toString(),
          name: item.productSnapshot.name,
          image: item.productSnapshot.image,
          slug: item.productSnapshot.slug
        },
        variant: {
          variantId: item.variantSnapshot.variantId.toString(),
          sku: item.variantSnapshot.sku,
          attributes: {
            size: item.variantSnapshot.attributes?.size || '',
            flavor: item.variantSnapshot.attributes?.flavor || ''
          }
        },
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      voucherCode: order.voucherCode,
      total: order.total,
      status: order.status,
      statusHistory: order.statusHistory.map(hist => ({
        status: hist.status,
        changedAt: hist.changedAt,
        changedBy: hist.changedBy ? hist.changedBy.toString() : null
      })),
      note: order.note,
      paymentMethod: order.paymentMethod,
      cancelReason: order.cancelReason,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  },

  orderListResponse: (orders) => {
    return orders.map(orderDto.orderResponse);
  }
};
