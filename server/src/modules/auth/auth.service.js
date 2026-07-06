import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { eventBus, EVENTS } from '../../utils/eventBus.js';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id.toString(), email: user.email, role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiry }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id.toString() },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiry }
  );
};

export const authService = {
  getUserById: async (id) => {
    return await authRepository.findById(id);
  },

  getUserByEmail: async (email) => {
    return await authRepository.findByEmail(email);
  },

  register: async (registerData) => {
    const { email, password, fullName, phone } = registerData;

    // Check duplicate email
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError(400, 'Email is already registered.');
    }

    // Check duplicate phone
    const existingPhone = await authRepository.findByPhone(phone);
    if (existingPhone) {
      throw new AppError(400, 'Phone number is already registered.');
    }

    // Create user
    const newUser = await authRepository.create({
      email,
      phone,
      passwordHash: password,
      role: 'customer'
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Emit event to create Customer profile
    eventBus.emit(EVENTS.USER_REGISTERED, {
      userId: newUser.id,
      fullName,
      phone,
      email
    });

    return { user: newUser, accessToken, refreshToken };
  },

  login: async (loginData) => {
    const { email, password } = loginData;

    const user = await authRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw new AppError(403, 'Account is deactivated. Please contact support.');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await authRepository.save(user);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  },

  refresh: async (refreshToken) => {
    if (!refreshToken) {
      throw new AppError(401, 'Refresh token required.');
    }

    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
      const user = await authRepository.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError(401, 'Invalid session or account deactivated.');
      }

      const accessToken = generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new AppError(401, 'Invalid or expired refresh token.');
    }
  }
};
