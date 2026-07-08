const { body } = require('express-validator');

const createInterviewValidator = [
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('company').optional().trim(),
  body('experience').isIn(['fresher', '0-1', '1-3', '3-5', '5-8', '8+']).withMessage('Invalid experience level'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('type').isIn(['technical', 'hr', 'behavioral', 'coding', 'mixed']).withMessage('Invalid interview type'),
  body('questionCount').isInt({ min: 1, max: 50 }).withMessage('Question count must be between 1 and 50'),
];

const submitAnswerValidator = [
  body('questionId').notEmpty().withMessage('questionId is required'),
  body('textAnswer').optional().isString(),
  body('transcribedAnswer').optional().isString(),
  body('codeAnswer.language').optional().isString(),
  body('codeAnswer.code').optional().isString(),
  body('timeTakenSeconds').optional().isInt({ min: 0 }),
];

module.exports = { createInterviewValidator, submitAnswerValidator };
