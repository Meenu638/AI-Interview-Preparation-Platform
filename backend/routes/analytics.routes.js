const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/trend', analyticsController.getScoreTrend);
router.get('/topics', analyticsController.getTopicPerformance);
router.get('/breakdown', analyticsController.getAverageBreakdown);

module.exports = router;
