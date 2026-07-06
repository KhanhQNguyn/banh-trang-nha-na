import { User } from './models/User.model.js';

export const authRepository = {
  findById: async (id) => {
    return await User.findById(id);
  },
  
  findByEmail: async (email) => {
    return await User.findOne({ email });
  },

  findByPhone: async (phone) => {
    return await User.findOne({ phone });
  },

  create: async (userData) => {
    return await User.create(userData);
  },

  save: async (user) => {
    return await user.save();
  }
};
