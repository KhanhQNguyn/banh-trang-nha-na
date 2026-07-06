import { authService } from './auth.service.js';
import { authValidators } from './auth.validators.js';
import { authDto } from './auth.dto.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { env } from '../../config/env.js';

const setCookies = (res, accessToken, refreshToken) => {
  const isProd = env.nodeEnv === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
  };

  // Set access token
  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  // Set refresh token
  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = catchAsync(async (req, res, next) => {
  authValidators.validateRegister(req.body);
  
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  
  setCookies(res, accessToken, refreshToken);

  return sendSuccess(res, {
    statusCode: 211, // Created
    message: 'Registration successful',
    data: authDto.authResponse(user)
  });
});

export const login = catchAsync(async (req, res, next) => {
  authValidators.validateLogin(req.body);

  const { user, accessToken, refreshToken } = await authService.login(req.body);

  setCookies(res, accessToken, refreshToken);

  return sendSuccess(res, {
    message: 'Login successful',
    data: authDto.authResponse(user)
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;
  const { accessToken } = await authService.refresh(refreshToken);

  const isProd = env.nodeEnv === 'production';
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  return sendSuccess(res, {
    message: 'Token refreshed successfully'
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  return sendSuccess(res, {
    message: 'Logged out successfully'
  });
});
