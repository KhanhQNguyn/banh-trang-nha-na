import { User } from './models/User.model.js';

export const authRepository = {
  findByEmail: async (email) => User.findOne({ email }),
  findById: async (id) => User.findById(id),
  create: async (data) => User.create(data),
  save: async (user) => user.save()
};
