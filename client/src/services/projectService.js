import api from './api';

// Get all projects (Admin)
export const getAllProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

// Get my projects (Employee/Client)
export const getMyProjects = async () => {
  const response = await api.get('/projects/my-projects');
  return response.data;
};

// Get project by ID
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Create project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

// Update project status (Employee)
export const updateProjectStatus = async (id, status) => {
  const response = await api.patch(`/projects/${id}/status`, { status });
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};
