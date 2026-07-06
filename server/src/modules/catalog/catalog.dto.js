export const catalogDto = {
  productResponse: (product) => {
    return {
      id: product.id || product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      promoPrice: product.promoPrice,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive,
      tags: product.tags || [],
      images: product.images.map(img => ({
        url: img.url,
        publicId: img.publicId,
        alt: img.alt,
        sortOrder: img.sortOrder
      })),
      variants: product.variants.map(v => ({
        id: v.id || v._id.toString(),
        sku: v.sku,
        attributes: {
          size: v.attributes?.size || '',
          flavor: v.attributes?.flavor || ''
        },
        priceModifier: v.priceModifier,
        stockQuantity: v.stockQuantity,
        isActive: v.isActive
      }))
    };
  },

  productListResponse: (products) => {
    return products.map(productDto.productResponse);
  },

  categoryResponse: (category) => {
    return {
      id: category.id || category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    };
  },

  categoryListResponse: (categories) => {
    return categories.map(catalogDto.categoryResponse);
  }
};
