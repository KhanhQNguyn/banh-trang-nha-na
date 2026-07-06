import mongoose from 'mongoose';
import { baseSchemaOptions } from '../../../utils/baseSchemaOptions.js';

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  fullAddress: { type: String, required: true },
  ward: { type: String },
  district: { type: String },
  city: { type: String },
  isDefault: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'FullName is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  addresses: [addressSchema],
  dateOfBirth: {
    type: Date
  }
}, baseSchemaOptions);

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
