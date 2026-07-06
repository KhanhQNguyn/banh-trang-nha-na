import { authService } from './auth.service.js';

export const authInterfaces = {
  getUserById: async (id) => {
    return await authService.getUserById(id);
  },
  getUserByEmail: async (email) => {
    return await authService.getUserByEmail(email);
  }
};
