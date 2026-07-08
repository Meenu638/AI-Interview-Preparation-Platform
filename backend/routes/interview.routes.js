const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { aiLimiter } = require('../middlewares/rateLimiter.middleware');
const { createInterviewValidator, submitAnswerValidator } = require('../validators/interview.validator');

router.use(protect);

router.post('/', aiLimiter, createInterviewValidator, validate, interviewController.createInterview);
router.get('/', interviewController.listInterviews);
router.get('/:id', interviewController.getInterview);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/answers', aiLimiter, submitAnswerValidator, validate, interviewController.submitAnswer);
router.post('/:id/complete', interviewController.completeInterview);
router.post('/:id/retake', aiLimiter, interviewController.retakeInterview);
router.patch('/:id/bookmark', interviewController.toggleBookmark);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
