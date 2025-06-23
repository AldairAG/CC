// apiClient.ts
import axios from 'axios';
import { store } from '../../store/store'; // Adjust the path to your Redux store

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/cc';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token in every request
apiClient.interceptors.request.use((config) => {
  const token = store.getState().user.token; // Assuming your auth slice has a token field
  
  console.log('Token from store:', token ? 'Present' : 'Not found');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization);
  } else {
    console.warn('No token found in store');
  }
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - token might be invalid or expired');
      // Optionally redirect to login or refresh token
    }
    
    return Promise.reject(error);
  }
);
