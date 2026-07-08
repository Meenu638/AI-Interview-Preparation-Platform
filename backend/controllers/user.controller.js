const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  new ApiResponse(200, 'Profile fetched.', { user }).send(res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  new ApiResponse(200, 'Profile updated.', { user }).send(res);
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userService.updateAvatar(req.user._id, req.file.buffer);
  new ApiResponse(200, 'Avatar updated.', { user }).send(res);
});

const updateSettings = asyncHandler(async (req, res) => {
  const user = await userService.updateSettings(req.user._id, req.body);
  new ApiResponse(200, 'Settings updated.', { user }).send(res);
});

const deactivateAccount = asyncHandler(async (req, res) => {
  await userService.deactivateAccount(req.user._id);
  new ApiResponse(200, 'Account deactivated.').send(res);
});

module.exports = { getProfile, updateProfile, updateAvatar, updateSettings, deactivateAccount };
