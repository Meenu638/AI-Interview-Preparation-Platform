const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const Interview = require('../models/Interview');
const userRepository = require('../repositories/user.repository');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalInterviews, activeToday, avgScoreAgg] = await Promise.all([
    User.countDocuments(),
    Interview.countDocuments({ status: 'completed' }),
    User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    Interview.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$overallScore' } } },
    ]),
  ]);

  new ApiResponse(200, 'Admin dashboard fetched.', {
    totalUsers,
    totalInterviews,
    activeToday,
    platformAverageScore: Math.round(avgScoreAgg[0]?.avg || 0),
  }).send(res);
});

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const filter = search ? { $text: { $search: search } } : {};
  const [users, total] = await Promise.all([
    userRepository.findAll(filter, { page: Number(page) || 1, limit: Number(limit) || 20 }),
    userRepository.countAll(filter),
  ]);
  new ApiResponse(200, 'Users fetched.', { users, total }).send(res);
});

const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  new ApiResponse(200, 'User status updated.', { user: user.toSafeObject() }).send(res);
});

const listInterviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const interviews = await Interview.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  new ApiResponse(200, 'Interviews fetched.', { interviews }).send(res);
});

module.exports = { getDashboard, listUsers, toggleUserActive, listInterviews };
