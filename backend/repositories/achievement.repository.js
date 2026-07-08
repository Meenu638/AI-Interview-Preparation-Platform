const Achievement = require('../models/Achievement');

const findByUser = (userId) => Achievement.find({ user: userId }).sort('-unlockedAt');

const hasAchievement = (userId, key) => Achievement.exists({ user: userId, key });

const create = (data) => Achievement.create(data);

const getLeaderboard = async (limit = 20) => {
  return Achievement.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        name: '$user.name',
        avatar: '$user.avatar',
        achievementCount: '$count',
      },
    },
  ]);
};

module.exports = { findByUser, hasAchievement, create, getLeaderboard };
