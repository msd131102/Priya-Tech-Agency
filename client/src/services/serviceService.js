import api from './api';

// Get all services
export const getAllServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

// Get service by ID
export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

// Create service
export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

// Update service
export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

// Delete service
export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};
