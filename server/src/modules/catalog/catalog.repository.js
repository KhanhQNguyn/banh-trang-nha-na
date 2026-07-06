import { Product } from './models/Product.model.js';
import { Category } from './models/Category.model.js';

export const catalogRepository = {
  // Product Queries
  findProducts: async (filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) => {
    return await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },

  countProducts: async (filter = {}) => {
    return await Product.countDocuments(filter);
  },

  findProductById: async (id) => {
    return await Product.findById(id);
  },

  findProductBySlug: async (slug) => {
    return await Product.findOne({ slug });
  },

  createProduct: async (productData) => {
    return await Product.create(productData);
  },

  saveProduct: async (product) => {
    return await product.save();
  },

  deleteProductById: async (id) => {
    return await Product.findByIdAndDelete(id);
  },

  // Category Queries
  findCategories: async (filter = {}, sort = { sortOrder: 1, name: 1 }) => {
    return await Category.find(filter).sort(sort);
  },

  findCategoryById: async (id) => {
    return await Category.findById(id);
  },

  findCategoryBySlug: async (slug) => {
    return await Category.findOne({ slug });
  },

  createCategory: async (categoryData) => {
    return await Category.create(categoryData);
  },

  saveCategory: async (category) => {
    return await category.save();
  },

  deleteCategoryById: async (id) => {
    return await Category.findByIdAndDelete(id);
  }
};
