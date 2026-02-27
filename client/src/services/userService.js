import api from './api';

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get messageable users (for current user's role)
export const getMessageableUsers = async () => {
  const response = await api.get('/users/messageable');
  return response.data;
};

// Get users by role
export const getUsersByRole = async (role) => {
  const response = await api.get(`/users/role/${role}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Create user
export const createUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Update own profile
export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
