const User = require('../models/User');

const create = (data) => User.create(data);

const findById = (id, withSensitive = false) => {
  const query = User.findById(id);
  if (withSensitive) query.select('+password');
  return query;
};

const findByEmail = (email, withSensitive = false) => {
  const query = User.findOne({ email: email.toLowerCase() });
  if (withSensitive) query.select('+password');
  return query;
};

const findByResetToken = (hashedToken) =>
  User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpire');

const updateById = (id, updates) =>
  User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

const deleteById = (id) => User.findByIdAndDelete(id);

const findAll = (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  return User.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

const countAll = (filter = {}) => User.countDocuments(filter);

const incrementStats = (id, { scoreDelta, questionCount }) =>
  User.findByIdAndUpdate(id, {
    $inc: {
      'stats.totalInterviews': 1,
      'stats.totalQuestionsAnswered': questionCount || 0,
    },
  });

module.exports = {
  create,
  findById,
  findByEmail,
  findByResetToken,
  updateById,
  deleteById,
  findAll,
  countAll,
  incrementStats,
};
