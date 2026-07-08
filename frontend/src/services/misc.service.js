import api from './api';

export const resumeService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  list: () => api.get('/resumes'),
};

export const notificationService = {
  list: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  remove: (id) => api.delete(`/notifications/${id}`),
};

export const achievementService = {
  list: () => api.get('/achievements'),
  leaderboard: (limit) => api.get('/achievements/leaderboard', { params: { limit } }),
};

export const analyticsService = {
  dashboard: () => api.get('/analytics/dashboard'),
  trend: (days) => api.get('/analytics/trend', { params: { days } }),
  topics: () => api.get('/analytics/topics'),
  breakdown: () => api.get('/analytics/breakdown'),
};

export const bookmarkService = {
  add: (questionId, note) => api.post('/bookmarks', { questionId, note }),
  list: () => api.get('/bookmarks'),
  remove: (id) => api.delete(`/bookmarks/${id}`),
};
