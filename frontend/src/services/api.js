import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

export default api;

export const getNotes = (token) =>
  api.get('/notes', { headers: { Authorization: `Bearer ${token}` } });

export const getNoteById = (id, token) =>
  api.get(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const createNote = (data, token) =>
  api.post('/notes', data, { headers: { Authorization: `Bearer ${token}` } });

export const updateNote = (id, data, token) =>
  api.put(`/notes/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteNote = (id, token) =>
  api.delete(`/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });