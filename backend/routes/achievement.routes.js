const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', achievementController.listAchievements);
router.get('/leaderboard', achievementController.getLeaderboard);

module.exports = router;
