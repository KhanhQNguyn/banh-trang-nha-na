import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id || user._id.toString(), email: user.email, role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiry }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user.id || user._id.toString() },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiry }
  );

export const authService = {
  login: async ({ email, password }) => {
    const user = await authRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password.');
    }
    if (!user.isActive) {
      throw new AppError(403, 'Account is deactivated. Please contact support.');
    }

    user.lastLoginAt = new Date();
    await authRepository.save(user);

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  },

  refresh: async (refreshToken) => {
    if (!refreshToken) throw new AppError(401, 'Refresh token required.');

    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
      const user = await authRepository.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid session or account deactivated.');
      }

      return { accessToken: generateAccessToken(user) };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(401, 'Invalid or expired refresh token.');
    }
  }
};
