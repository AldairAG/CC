// apiClient.ts
import axios from 'axios';
import { store } from '../../store/store'; // Adjust the path to your Redux store
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/cc';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the token in every request
apiClient.interceptors.request.use((config) => {
  const token = store.getState().user.token; // Assuming your auth slice has a token field
  
  if (import.meta.env.MODE === 'development') {
    //console.log('🔗 API Request:', config.method?.toUpperCase(), config.url);
    //console.log('🔑 Token:', token ? 'Present' : 'Not found');
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  console.error('❌ Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error('❌ API Error:', {
      status,
      message,
      url: error.config?.url
    });
    
    // Handle different error cases
    switch (status) {
      case 401:
        console.warn('🚫 Unauthorized - redirecting to login');
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        // Optionally dispatch logout action
        break;
      case 403:
        toast.error('No tienes permisos para realizar esta acción');
        break;
      case 404:
        toast.error('Recurso no encontrado');
        break;
      case 500:
        toast.error('Error interno del servidor. Intenta nuevamente.');
        break;
      default:
        if (status >= 400) {
          toast.error(message || 'Ocurrió un error inesperado');
        }
    }
    
    return Promise.reject(error);
  }
);
