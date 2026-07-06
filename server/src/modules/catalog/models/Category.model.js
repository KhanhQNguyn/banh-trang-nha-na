import mongoose from 'mongoose';
import { baseSchemaOptions } from '../../../utils/baseSchemaOptions.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, baseSchemaOptions);

// Generate slug hook before validating
categorySchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
      .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
      .replace(/[íìỉĩị]/g, 'i')
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
      .replace(/[úùủũụưứừửữự]/g, 'u')
      .replace(/[ýỳỷỹỵ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
  }
  next();
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
