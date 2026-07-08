const { body } = require('express-validator');

const updateProfileValidator = [
  body('name').optional().trim().isLength({ max: 60 }),
  body('targetRole').optional().trim().isLength({ max: 100 }),
  body('experience').optional().isIn(['fresher', '0-1', '1-3', '3-5', '5-8', '8+']),
  body('skills').optional().isArray(),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('socialLinks.linkedin').optional().trim().isURL().withMessage('Invalid LinkedIn URL'),
  body('socialLinks.github').optional().trim().isURL().withMessage('Invalid GitHub URL'),
  body('socialLinks.portfolio').optional().trim().isURL().withMessage('Invalid portfolio URL'),
];

module.exports = { updateProfileValidator };
