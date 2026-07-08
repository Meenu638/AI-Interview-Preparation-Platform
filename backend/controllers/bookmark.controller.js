const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bookmarkRepository = require('../repositories/bookmark.repository');
const ApiError = require('../utils/ApiError');

const addBookmark = asyncHandler(async (req, res) => {
  const exists = await bookmarkRepository.exists(req.user._id, req.body.questionId);
  if (exists) throw ApiError.conflict('Question already bookmarked.');
  const bookmark = await bookmarkRepository.create({
    user: req.user._id,
    question: req.body.questionId,
    note: req.body.note || '',
  });
  new ApiResponse(201, 'Question bookmarked.', { bookmark }).send(res);
});

const listBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkRepository.findByUser(req.user._id);
  new ApiResponse(200, 'Bookmarks fetched.', { bookmarks }).send(res);
});

const removeBookmark = asyncHandler(async (req, res) => {
  await bookmarkRepository.deleteById(req.params.id, req.user._id);
  new ApiResponse(200, 'Bookmark removed.').send(res);
});

module.exports = { addBookmark, listBookmarks, removeBookmark };
