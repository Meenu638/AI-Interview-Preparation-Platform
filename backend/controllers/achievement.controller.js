const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const achievementService = require('../services/achievement.service');

const listAchievements = asyncHandler(async (req, res) => {
  const achievements = await achievementService.getUserAchievements(req.user._id);
  new ApiResponse(200, 'Achievements fetched.', {
    achievements,
    allBadges: achievementService.BADGES.map(({ condition, ...b }) => b),
  }).send(res);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await achievementService.getLeaderboard(Number(req.query.limit) || 20);
  new ApiResponse(200, 'Leaderboard fetched.', { leaderboard }).send(res);
});

module.exports = { listAchievements, getLeaderboard };
