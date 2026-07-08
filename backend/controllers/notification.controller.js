const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const notificationService = require('../services/notification.service');

const listNotifications = asyncHandler(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;
  const notifications = await notificationService.listNotifications(req.user._id, {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    unreadOnly: unreadOnly === 'true',
  });
  const unreadCount = await notificationService.getUnreadCount(req.user._id);
  new ApiResponse(200, 'Notifications fetched.', { notifications, unreadCount }).send(res);
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.user._id, req.params.id);
  new ApiResponse(200, 'Notification marked as read.', { notification }).send(res);
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user._id);
  new ApiResponse(200, 'All notifications marked as read.').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await notificationService.remove(req.user._id, req.params.id);
  new ApiResponse(200, 'Notification deleted.').send(res);
});

module.exports = { listNotifications, markRead, markAllRead, remove };
