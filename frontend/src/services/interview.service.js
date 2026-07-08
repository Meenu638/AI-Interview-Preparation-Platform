import api from './api';

export const interviewService = {
  create: (payload) => api.post('/interviews', payload),
  list: (params) => api.get('/interviews', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
  start: (id) => api.post(`/interviews/${id}/start`),
  submitAnswer: (id, payload) => api.post(`/interviews/${id}/answers`, payload),
  complete: (id) => api.post(`/interviews/${id}/complete`),
  retake: (id) => api.post(`/interviews/${id}/retake`),
  toggleBookmark: (id) => api.patch(`/interviews/${id}/bookmark`),
  delete: (id) => api.delete(`/interviews/${id}`),
};
