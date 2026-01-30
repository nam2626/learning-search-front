import axios from 'axios';

const API_BASE_URL = 'https://nam3324.synology.me:32902';
// const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = ['/api/auth/login', '/api/auth/register'];

apiClient.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(
      (endpoint) => config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
