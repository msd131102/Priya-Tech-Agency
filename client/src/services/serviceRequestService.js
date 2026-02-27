import api from './api';

// Send service request to admin
export const sendServiceRequest = async (requestData) => {
  const response = await api.post('/service-requests', requestData);
  return response.data;
};

// Get all service requests (Admin only)
export const getAllServiceRequests = async () => {
  const response = await api.get('/service-requests');
  return response.data;
};

// Get my service requests (Client)
export const getMyServiceRequests = async () => {
  const response = await api.get('/service-requests/my-requests');
  return response.data;
};

// Approve service request (Admin only)
export const approveServiceRequest = async (requestId, data) => {
  const response = await api.put(`/service-requests/${requestId}/approve`, data);
  return response.data;
};

// Reject service request (Admin only)
export const rejectServiceRequest = async (requestId, data) => {
  const response = await api.put(`/service-requests/${requestId}/reject`, data);
  return response.data;
};

export default { 
  sendServiceRequest, 
  getAllServiceRequests, 
  getMyServiceRequests,
  approveServiceRequest,
  rejectServiceRequest 
};
