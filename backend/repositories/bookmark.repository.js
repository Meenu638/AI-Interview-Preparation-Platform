const Bookmark = require('../models/Bookmark');

const create = (data) => Bookmark.create(data);

const findByUser = (userId) =>
  Bookmark.find({ user: userId }).populate('question').sort('-createdAt');

const deleteById = (id, userId) => Bookmark.findOneAndDelete({ _id: id, user: userId });

const exists = (userId, questionId) => Bookmark.exists({ user: userId, question: questionId });

module.exports = { create, findByUser, deleteById, exists };
