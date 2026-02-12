import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  // Use relative path for production (will be proxied by Nginx)
  // For dev, Vite proxy handles this
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
