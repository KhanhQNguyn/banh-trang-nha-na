import { catalogRepository } from './catalog.repository.js';
import { AppError } from '../../utils/AppError.js';
import { eventBus, EVENTS } from '../../utils/eventBus.js';
import { Product } from './models/Product.model.js'; // imported ONLY for mongoose query inside decrementStock if needed, or we can use catalogRepository methods. Let's write the query inside catalogRepository and call it, or perform it safely.

export const catalogService = {
  // Product logic
  getProductById: async (id) => {
    return await catalogRepository.findProductById(id);
  },

  getProductBySlug: async (slug) => {
    return await catalogRepository.findProductBySlug(slug);
  },

  getVariantById: async (productId, variantId) => {
    const product = await catalogRepository.findProductById(productId);
    if (!product) throw new AppError(404, 'Product not found');
    
    const variant = product.variants.id(variantId);
    if (!variant) throw new AppError(404, 'Variant not found');
    
    return variant;
  },

  queryProducts: async (filters = {}, pagination = {}) => {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const dbFilter = { isActive: true };

    if (filters.categorySlug) {
      const category = await catalogRepository.findCategoryBySlug(filters.categorySlug);
      if (category) {
        dbFilter.categoryId = category._id;
      } else {
        // If category is not found, return empty results
        return { products: [], total: 0 };
      }
    }

    if (filters.search) {
      dbFilter.$text = { $search: filters.search };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      dbFilter.basePrice = {};
      if (filters.minPrice !== undefined) dbFilter.basePrice.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) dbFilter.basePrice.$lte = filters.maxPrice;
    }

    const products = await catalogRepository.findProducts(dbFilter, skip, limit);
    const total = await catalogRepository.countProducts(dbFilter);

    return { products, total };
  },

  createProduct: async (productData) => {
    return await catalogRepository.createProduct(productData);
  },

  updateProduct: async (id, updateData) => {
    const product = await catalogRepository.findProductById(id);
    if (!product) throw new AppError(404, 'Product not found');

    Object.assign(product, updateData);
    return await catalogRepository.saveProduct(product);
  },

  deleteProduct: async (id) => {
    return await catalogRepository.deleteProductById(id);
  },

  // Stock operations
  decrementStock: async (productId, variantId, quantity, session = null) => {
    const options = session ? { session } : {};
    
    // Perform atomic decrement
    const updated = await Product.findOneAndUpdate(
      {
        _id: productId,
        'variants._id': variantId,
        'variants.stockQuantity': { $gte: quantity }
      },
      {
        $inc: { 'variants.$.stockQuantity': -quantity }
      },
      {
        new: true,
        ...options
      }
    );

    if (!updated) {
      throw new AppError(400, 'Insufficient stock or variant not found');
    }

    const variant = updated.variants.id(variantId);
    if (variant && variant.stockQuantity < 5) {
      eventBus.emit(EVENTS.STOCK_LOW, {
        productId,
        variantId,
        sku: variant.sku,
        stockQuantity: variant.stockQuantity
      });
    }

    return updated;
  },

  incrementStock: async (productId, variantId, quantity) => {
    const updated = await Product.findOneAndUpdate(
      {
        _id: productId,
        'variants._id': variantId
      },
      {
        $inc: { 'variants.$.stockQuantity': quantity }
      },
      { new: true }
    );

    if (!updated) {
      console.warn(`Failed to restock variant ${variantId} on product ${productId}: Not found`);
    }
    return updated;
  },

  // Category Logic
  getCategories: async (includeInactive = false) => {
    const filter = includeInactive ? {} : { isActive: true };
    return await catalogRepository.findCategories(filter);
  },

  getCategoryBySlug: async (slug) => {
    return await catalogRepository.findCategoryBySlug(slug);
  },

  createCategory: async (categoryData) => {
    return await catalogRepository.createCategory(categoryData);
  },

  updateCategory: async (id, updateData) => {
    const category = await catalogRepository.findCategoryById(id);
    if (!category) throw new AppError(404, 'Category not found');

    Object.assign(category, updateData);
    return await catalogRepository.saveCategory(category);
  },

  deleteCategory: async (id) => {
    return await catalogRepository.deleteCategoryById(id);
  }
};
