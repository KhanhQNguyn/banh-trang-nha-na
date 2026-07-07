import mongoose from 'mongoose';
import { User } from '../src/modules/auth/models/User.model.js';
import { env } from '../src/config/env.js';

const seedAdmin = async () => {
  try {
    console.log('Starting admin seeding...');
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to database.');

    const email = env.adminEmail;
    const password = env.adminPassword;

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin with email ${email} already exists.`);
      process.exit(0);
    }

    await User.create({ email, passwordHash: password, role: 'admin', isActive: true });

    console.log('Admin account seeded successfully.');
    console.log(`Email: ${email}`);
    console.log('Password: (as specified in environment)');
    process.exit(0);
  } catch (error) {
    console.error(`Admin seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
