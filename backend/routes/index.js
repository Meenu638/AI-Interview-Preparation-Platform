const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/interviews', require('./interview.routes'));
router.use('/resumes', require('./resume.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/achievements', require('./achievement.routes'));
router.use('/bookmarks', require('./bookmark.routes'));
router.use('/analytics', require('./analytics.routes'));
router.use('/admin', require('./admin.routes'));

router.get('/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));

module.exports = router;
