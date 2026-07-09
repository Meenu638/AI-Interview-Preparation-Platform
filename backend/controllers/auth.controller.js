const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const { setAuthCookies, clearAuthCookies } = require('../utils/generateTokens');

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  new ApiResponse(201, 'Account created successfully.', { user, accessToken }).send(res);
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  setAuthCookies(res, accessToken, refreshToken);
  new ApiResponse(200, 'Logged in successfully.', { user, accessToken }).send(res);
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  const { user, accessToken } = await authService.refresh(refreshToken);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });
  new ApiResponse(200, 'Token refreshed.', { user, accessToken }).send(res);
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  await authService.logout(refreshToken);
  clearAuthCookies(res);
  new ApiResponse(200, 'Logged out successfully.').send(res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'https://frontend-two-tan-16.vercel.app';
  await authService.forgotPassword(req.body.email, clientUrl);
  new ApiResponse(200, 'If that email exists, a reset link has been sent.').send(res);
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  new ApiResponse(200, 'Password has been reset. Please log in.').send(res);
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body.currentPassword, req.body.newPassword);
  new ApiResponse(200, 'Password changed successfully.').send(res);
});

const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(200, 'Current user fetched.', { user: req.user.toSafeObject() }).send(res);
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
