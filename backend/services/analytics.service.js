const interviewRepository = require('../repositories/interview.repository');
const questionRepository = require('../repositories/question.repository');
const feedbackRepository = require('../repositories/feedback.repository');
const userRepository = require('../repositories/user.repository');

const getDashboardStats = async (userId) => {
  const user = await userRepository.findById(userId);
  const recentInterviews = await interviewRepository.getRecentByUser(userId, 5);
  const typeBreakdown = await interviewRepository.aggregateByType(userId);
  const topicScores = await questionRepository.aggregateTopicScores(userId);

  const sortedTopics = topicScores.filter((t) => t._id).sort((a, b) => b.avgScore - a.avgScore);
  const strongTopics = sortedTopics.slice(0, 3).map((t) => t._id);
  const weakTopics = sortedTopics.slice(-3).reverse().map((t) => t._id);

  return {
    stats: user.stats,
    streak: user.streak,
    recentInterviews,
    typeBreakdown,
    weakTopics,
    strongTopics,
  };
};

const getScoreTrend = async (userId, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return interviewRepository.getScoreTrend(userId, since);
};

const getTopicPerformance = async (userId) => questionRepository.aggregateTopicScores(userId);

const getAverageBreakdown = async (userId) => {
  const result = await feedbackRepository.aggregateAverages(userId);
  return (
    result[0] || {
      technicalScore: 0,
      communicationScore: 0,
      grammarScore: 0,
      confidenceScore: 0,
      problemSolvingScore: 0,
      overallScore: 0,
    }
  );
};

module.exports = { getDashboardStats, getScoreTrend, getTopicPerformance, getAverageBreakdown };
