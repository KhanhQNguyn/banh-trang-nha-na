import { authService } from './auth.service.js';
import { authValidators } from './auth.validators.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { env } from '../../config/env.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
};

export const login = catchAsync(async (req, res) => {
  authValidators.validateLogin(req.body);

  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

  return sendSuccess(res, {
    message: 'Login successful',
    data: {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role }
    }
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies?.refresh_token;
  const { accessToken } = await authService.refresh(token);

  return sendSuccess(res, {
    message: 'Token refreshed',
    data: { accessToken }
  });
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie('refresh_token', REFRESH_COOKIE_OPTIONS);

  return sendSuccess(res, { message: 'Logged out successfully' });
});
