import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the request URL
    let token = null;

    if (config.url.includes('/rider/') || config.url.includes('/rider-auth/')) {
      // Rider-specific routes use riderToken
      token = localStorage.getItem('riderToken');
    } else {
      // All other routes use authToken (user/admin)
      token = localStorage.getItem('authToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Determine which authentication failed based on the request URL
      const isRiderRequest = error.config?.url?.includes('/rider/') || error.config?.url?.includes('/rider-auth/');

      if (isRiderRequest) {
        // Rider authentication failed
        localStorage.removeItem('riderToken');
        localStorage.removeItem('riderRefreshToken');
        localStorage.removeItem('rider');
        // Only redirect if we're on a rider page
        if (window.location.pathname.startsWith('/rider')) {
          window.location.href = '/rider/login';
        }
      } else {
        // User authentication failed
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Only redirect if we're on a user page
        if (!window.location.pathname.startsWith('/rider') && !window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;