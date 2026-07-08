import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (payload) => api.patch('/users/profile', payload),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateSettings: (payload) => api.patch('/users/settings', payload),
  deactivateAccount: () => api.delete('/users/deactivate'),
};
