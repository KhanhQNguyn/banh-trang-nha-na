import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config();

const requiredEnvs = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

// Check missing envs in production or development
const missingEnvs = requiredEnvs.filter(envName => !process.env[envName]);
if (missingEnvs.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvs.join(', ')}`);
}

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/banh-trang-nha-na',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'mock',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || 'mock',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'mock',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(','),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@banhtrangnhana.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'adminPassword123'
};
