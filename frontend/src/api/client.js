import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getActuatorHealth = async () => {
  // Direct fetch through proxy or relative path
  const response = await axios.get('/actuator/health');
  return response.data;
};

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const registerService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

export const getDeployments = async (serviceId) => {
  const params = serviceId ? { serviceId } : {};
  const response = await api.get('/deployments', { params });
  return response.data;
};

export const recordDeployment = async (deploymentData) => {
  const response = await api.post('/deployments', deploymentData);
  return response.data;
};

export default api;
