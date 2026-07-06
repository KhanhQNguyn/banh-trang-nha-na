import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`📡 Connected to database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};
