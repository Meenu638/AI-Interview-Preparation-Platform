const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileValidator } = require('../validators/user.validator');
const { uploadAvatar } = require('../middlewares/upload.middleware');

router.use(protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', updateProfileValidator, validate, userController.updateProfile);
router.post('/avatar', uploadAvatar.single('avatar'), userController.updateAvatar);
router.patch('/settings', userController.updateSettings);
router.delete('/deactivate', userController.deactivateAccount);

module.exports = router;
