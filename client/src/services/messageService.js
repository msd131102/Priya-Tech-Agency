import api from './api';

// Get messages with a specific user
export const getMessages = async (userId) => {
  const response = await api.get(`/messages/user/${userId}`);
  return response.data;
};

// Get messages for a project
export const getProjectMessages = async (projectId) => {
  const response = await api.get(`/messages/project/${projectId}`);
  return response.data;
};

// Get my messages
export const getMyMessages = async () => {
  const response = await api.get('/messages/my-messages');
  return response.data;
};

// Send message
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

// Mark message as read
export const markAsRead = async (id) => {
  const response = await api.patch(`/messages/${id}/read`);
  return response.data;
};

// Delete message
export const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};
