const Interview = require('../models/Interview');

const create = (data) => Interview.create(data);

const findById = (id) => Interview.findById(id).populate('questions');

const findByIdRaw = (id) => Interview.findById(id);

const findByUser = (userId, options = {}) => {
  const { page = 1, limit = 10, status, search, sort = '-createdAt' } = options;
  const filter = { user: userId };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  return Interview.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

const countByUser = (userId, filter = {}) => Interview.countDocuments({ user: userId, ...filter });

const updateById = (id, updates) =>
  Interview.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteById = (id) => Interview.findByIdAndDelete(id);

const getRecentByUser = (userId, limit = 5) =>
  Interview.find({ user: userId, status: 'completed' }).sort('-completedAt').limit(limit);

const getScoreTrend = (userId, sinceDate) =>
  Interview.find({
    user: userId,
    status: 'completed',
    completedAt: { $gte: sinceDate },
  })
    .select('completedAt overallScore role type')
    .sort('completedAt');

const aggregateByType = (userId) =>
  Interview.aggregate([
    { $match: { user: userId, status: 'completed' } },
    {
      $group: {
        _id: '$type',
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 },
      },
    },
  ]);

module.exports = {
  create,
  findById,
  findByIdRaw,
  findByUser,
  countByUser,
  updateById,
  deleteById,
  getRecentByUser,
  getScoreTrend,
  aggregateByType,
};
