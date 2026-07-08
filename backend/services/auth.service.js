const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} = require('../utils/generateTokens');
const emailService = require('./email.service');
const Session = require('../models/Session');

const register = async ({ name, email, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw ApiError.conflict('An account with this email already exists.');

  const user = await userRepository.create({ name, email, password });
  emailService.sendWelcomeEmail(user.email, user.name).catch(() => {});

  return issueTokens(user, '', '');
};

const login = async ({ email, password }, meta = {}) => {
  const user = await userRepository.findByEmail(email, true);
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password.');
  }
  if (!user.isActive) throw ApiError.forbidden('This account has been deactivated.');

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return issueTokens(user, meta.userAgent, meta.ip);
};

const issueTokens = async (user, userAgent = '', ip = '') => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  await Session.create({
    user: user._id,
    refreshTokenHash: hashToken(refreshToken),
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user: user.toSafeObject(), accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized('No refresh token provided.');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token.');
  }

  const tokenHash = hashToken(refreshToken);
  const session = await Session.findOne({
    user: decoded.id,
    refreshTokenHash: tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!session) throw ApiError.unauthorized('Session not found or revoked. Please log in again.');

  const user = await userRepository.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('User no longer exists.');

  const accessToken = generateAccessToken(user._id, user.role);
  return { user: user.toSafeObject(), accessToken };
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);
  await Session.updateOne({ refreshTokenHash: tokenHash }, { revokedAt: new Date() });
};

const forgotPassword = async (email, resetUrlBase) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return; // Do not leak whether the email exists

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${resetUrlBase}/reset-password/${resetToken}`;
  await emailService.sendPasswordResetEmail(user.email, resetUrl);
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userRepository.findByResetToken(hashedToken);
  if (!user) throw ApiError.badRequest('Token is invalid or has expired.');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  await Session.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findById(userId, true);
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect.');
  }
  user.password = newPassword;
  await user.save();
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
};
