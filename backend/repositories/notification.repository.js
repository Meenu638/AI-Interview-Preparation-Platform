const Notification = require('../models/Notification');

const create = (data) => Notification.create(data);

const findByUser = (userId, options = {}) => {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  const filter = { user: userId };
  if (unreadOnly) filter.isRead = false;
  return Notification.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
};

const countUnread = (userId) => Notification.countDocuments({ user: userId, isRead: false });

const markAsRead = (id, userId) =>
  Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true });

const markAllAsRead = (userId) => Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

const deleteById = (id, userId) => Notification.findOneAndDelete({ _id: id, user: userId });

module.exports = { create, findByUser, countUnread, markAsRead, markAllAsRead, deleteById };
