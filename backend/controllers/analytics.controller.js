const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analytics.service');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboardStats(req.user._id);
  new ApiResponse(200, 'Dashboard data fetched.', data).send(res);
});

const getScoreTrend = asyncHandler(async (req, res) => {
  const trend = await analyticsService.getScoreTrend(req.user._id, Number(req.query.days) || 30);
  new ApiResponse(200, 'Score trend fetched.', { trend }).send(res);
});

const getTopicPerformance = asyncHandler(async (req, res) => {
  const topics = await analyticsService.getTopicPerformance(req.user._id);
  new ApiResponse(200, 'Topic performance fetched.', { topics }).send(res);
});

const getAverageBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await analyticsService.getAverageBreakdown(req.user._id);
  new ApiResponse(200, 'Average breakdown fetched.', { breakdown }).send(res);
});

module.exports = { getDashboard, getScoreTrend, getTopicPerformance, getAverageBreakdown };
