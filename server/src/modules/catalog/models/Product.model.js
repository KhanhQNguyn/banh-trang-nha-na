import mongoose from 'mongoose';
import { baseSchemaOptions } from '../../../utils/baseSchemaOptions.js';

const variantSchema = new mongoose.Schema({
  sku: { type: String },
  attributes: {
    size: { type: String },
    flavor: { type: String }
  },
  priceModifier: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const productImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  alt: { type: String },
  sortOrder: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  images: [productImageSchema],
  basePrice: {
    type: Number,
    required: [true, 'Product base price is required'],
    min: 0
  },
  promoPrice: {
    type: Number,
    default: null
  },
  variants: [variantSchema],
  searchName: {
    type: String,
    index: true
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, baseSchemaOptions);

// Utility function to strip diacritics
const removeDiacritics = str => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim();
};

// Generate slug and searchName before validating
productSchema.pre('validate', function(next) {
  if (this.name) {
    if (!this.slug) {
      this.slug = removeDiacritics(this.name).replace(/[\s-]+/g, '-');
    }
    this.searchName = removeDiacritics(this.name);
  }
  
  // Ensure every product has at least one variant
  if (this.variants.length === 0) {
    this.variants.push({
      sku: `${this.slug}-default`,
      attributes: {
        size: '',
        flavor: ''
      },
      priceModifier: 0,
      stockQuantity: 0,
      isActive: true
    });
  }
  next();
});

// Compound index for search
productSchema.index({ searchName: 'text', description: 'text' });

// Supports the storefront listing/featured queries which always filter on
// isActive and often on isFeatured (e.g. GET /products?isFeatured=true).
productSchema.index({ isActive: 1, isFeatured: 1 });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Variant = mongoose.model('Variant', variantSchema); // Optional export, schema is embedded
