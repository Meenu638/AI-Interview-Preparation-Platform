const notificationRepository = require('../repositories/notification.repository');

const notify = (userId, { type, title, message, link = '', metadata = {} }) =>
  notificationRepository.create({ user: userId, type, title, message, link, metadata });

const listNotifications = (userId, options) => notificationRepository.findByUser(userId, options);

const getUnreadCount = (userId) => notificationRepository.countUnread(userId);

const markRead = (userId, notificationId) => notificationRepository.markAsRead(notificationId, userId);

const markAllRead = (userId) => notificationRepository.markAllAsRead(userId);

const remove = (userId, notificationId) => notificationRepository.deleteById(notificationId, userId);

module.exports = { notify, listNotifications, getUnreadCount, markRead, markAllRead, remove };
