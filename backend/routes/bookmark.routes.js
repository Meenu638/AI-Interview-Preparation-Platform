const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/', bookmarkController.addBookmark);
router.get('/', bookmarkController.listBookmarks);
router.delete('/:id', bookmarkController.removeBookmark);

module.exports = router;
