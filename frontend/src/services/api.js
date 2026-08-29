import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

export const getProfile = (token) =>
  api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

export const updateProfile = (data, token) =>
  api.put('/auth/me', data, { headers: { Authorization: `Bearer ${token}` } });

export default api;

export const getNotes = (token, params = {}) =>
  api.get('/notes', { headers: { Authorization: `Bearer ${token}` }, params });

export const getNoteById = (id, token) =>
  api.get(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const createNote = (data, token) =>
  api.post('/notes', data, { headers: { Authorization: `Bearer ${token}` } });

export const updateNote = (id, data, token) =>
  api.put(`/notes/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteNote = (id, token) =>
  api.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const togglePinNote = (id, token) =>
  api.patch(`/notes/${id}/pin`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const toggleArchiveNote = (id, token) =>
  api.patch(`/notes/${id}/archive`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const duplicateNote = (id, token) =>
  api.post(`/notes/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${token}` } });