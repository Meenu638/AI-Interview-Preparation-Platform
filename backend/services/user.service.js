const userRepository = require('../repositories/user.repository');
const cloudinaryService = require('./cloudinary.service');
const ApiError = require('../utils/ApiError');

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw ApiError.notFound('User not found.');
  return user.toSafeObject();
};

const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'targetRole', 'experience', 'skills', 'bio', 'socialLinks'];
  const payload = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) payload[field] = updates[field];
  }
  const user = await userRepository.updateById(userId, payload);
  if (!user) throw ApiError.notFound('User not found.');
  return user.toSafeObject();
};

const updateAvatar = async (userId, fileBuffer) => {
  const user = await userRepository.findById(userId);
  if (!user) throw ApiError.notFound('User not found.');

  if (user.avatar?.publicId) {
    cloudinaryService.deleteAsset(user.avatar.publicId).catch(() => {});
  }

  const result = await cloudinaryService.uploadAvatarBuffer(fileBuffer, userId);
  user.avatar = { url: result.secure_url, publicId: result.public_id };
  await user.save({ validateBeforeSave: false });

  return user.toSafeObject();
};

const updateSettings = async (userId, settings) => {
  const user = await userRepository.updateById(userId, { settings });
  if (!user) throw ApiError.notFound('User not found.');
  return user.toSafeObject();
};

const deactivateAccount = async (userId) => {
  await userRepository.updateById(userId, { isActive: false });
};

module.exports = { getProfile, updateProfile, updateAvatar, updateSettings, deactivateAccount };
