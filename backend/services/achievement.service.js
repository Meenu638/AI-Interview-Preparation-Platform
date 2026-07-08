const achievementRepository = require('../repositories/achievement.repository');
const userRepository = require('../repositories/user.repository');
const notificationService = require('./notification.service');

const BADGES = [
  {
    key: 'first-interview',
    title: 'First Steps',
    description: 'Completed your first interview',
    icon: 'FaFlagCheckered',
    tier: 'bronze',
    condition: (user) => user.stats.totalInterviews >= 1,
  },
  {
    key: 'interviews-10',
    title: 'Getting Serious',
    description: 'Completed 10 interviews',
    icon: 'FaMedal',
    tier: 'silver',
    condition: (user) => user.stats.totalInterviews >= 10,
  },
  {
    key: 'interviews-50',
    title: 'Interview Veteran',
    description: 'Completed 50 interviews',
    icon: 'FaTrophy',
    tier: 'gold',
    condition: (user) => user.stats.totalInterviews >= 50,
  },
  {
    key: 'streak-7',
    title: 'Week Warrior',
    description: '7-day practice streak',
    icon: 'FaFire',
    tier: 'silver',
    condition: (user) => user.streak.current >= 7,
  },
  {
    key: 'streak-30',
    title: 'Unstoppable',
    description: '30-day practice streak',
    icon: 'FaFireAlt',
    tier: 'platinum',
    condition: (user) => user.streak.current >= 30,
  },
  {
    key: 'perfect-score',
    title: 'Perfectionist',
    description: 'Scored 95+ on an interview',
    icon: 'FaStar',
    tier: 'gold',
    condition: (user) => user.stats.averageScore >= 95,
  },
];

const evaluateAndUnlock = async (userId) => {
  const user = await userRepository.findById(userId);
  const unlocked = [];

  for (const badge of BADGES) {
    const already = await achievementRepository.hasAchievement(userId, badge.key);
    if (already) continue;

    if (badge.condition(user)) {
      const achievement = await achievementRepository.create({
        user: userId,
        key: badge.key,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        tier: badge.tier,
      });
      unlocked.push(achievement);

      await notificationService.notify(userId, {
        type: 'achievement-unlock',
        title: 'Achievement Unlocked!',
        message: `You earned "${badge.title}" — ${badge.description}`,
      });
    }
  }

  return unlocked;
};

const getUserAchievements = (userId) => achievementRepository.findByUser(userId);

const getLeaderboard = (limit) => achievementRepository.getLeaderboard(limit);

module.exports = { BADGES, evaluateAndUnlock, getUserAchievements, getLeaderboard };
