const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadResume } = require('../middlewares/upload.middleware');

router.use(protect);

router.post('/', uploadResume.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.listResumes);

module.exports = router;
