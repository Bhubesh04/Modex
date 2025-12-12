import axios from 'axios';
import storage from '../utils/storage';

// Production backend URL - all routes are prefixed with /api/
// Backend: https://modex-2.onrender.com
// Full API base: https://modex-2.onrender.com/api

// Get API URL from environment variable or use default
let API_URL = process.env.REACT_APP_API_URL || 'https://modex-2.onrender.com/api';

// CRITICAL FIX: Ensure API_URL ALWAYS includes /api prefix
// This handles cases where env var is set incorrectly
const BACKEND_DOMAIN = 'modex-2.onrender.com';

// Normalize the URL
API_URL = API_URL.trim();

// If it doesn't contain /api, add it
if (!API_URL.includes('/api')) {
  // Remove trailing slash
  API_URL = API_URL.replace(/\/+$/, '');
  // Add /api
  API_URL = API_URL + '/api';
} else {
  // If it contains /api, ensure it's at the end
  // Remove any trailing slashes first
  API_URL = API_URL.replace(/\/+$/, '');
  // If /api is not at the end, fix it
  if (!API_URL.endsWith('/api')) {
    // Extract domain
    const domainMatch = API_URL.match(/https?:\/\/[^\/]+/);
    if (domainMatch) {
      API_URL = domainMatch[0] + '/api';
    } else {
      API_URL = 'https://' + BACKEND_DOMAIN + '/api';
    }
  }
}

// Final cleanup - remove trailing slash
API_URL = API_URL.replace(/\/+$/, '');

// Verify it's correct
if (!API_URL.includes(BACKEND_DOMAIN) || !API_URL.endsWith('/api')) {
  console.error('⚠️ API_URL configuration error, using fallback');
  API_URL = 'https://' + BACKEND_DOMAIN + '/api';
}

// Log API URL for debugging (always log in production for troubleshooting)
console.log('🔗 API Base URL:', API_URL);
console.log('🔗 Environment:', process.env.NODE_ENV || 'production');
console.log('🔗 REACT_APP_API_URL (raw):', process.env.REACT_APP_API_URL || 'NOT SET');
console.log('🔗 Final API_URL:', API_URL);

// Create axios instance with guaranteed correct baseURL
const axiosInstance = axios.create({
  baseURL: API_URL, // This is guaranteed to end with /api
  timeout: 30000, // 30 second timeout for Render free tier
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Override baseURL getter to ensure it's always correct
Object.defineProperty(axiosInstance.defaults, 'baseURL', {
  get: function() {
    return API_URL; // Always return the corrected URL
  },
  set: function(value) {
    // If someone tries to set it, ensure it has /api
    if (value && !value.endsWith('/api')) {
      value = value.replace(/\/+$/, '') + '/api';
    }
    API_URL = value;
  },
  configurable: true
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    // CRITICAL: Ensure baseURL always has /api
    if (config.baseURL && !config.baseURL.endsWith('/api')) {
      console.warn('⚠️ baseURL missing /api, fixing:', config.baseURL);
      config.baseURL = config.baseURL.replace(/\/+$/, '') + '/api';
      console.warn('✅ Fixed baseURL:', config.baseURL);
    }
    
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    const fullURL = (config.baseURL || '') + (config.url || '');
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Base URL:', config.baseURL);
    console.log('📤 Full URL:', fullURL);
    
    // Final verification - if full URL doesn't have /api, log error
    if (fullURL && !fullURL.includes('/api/') && !fullURL.endsWith('/api')) {
      console.error('❌ CRITICAL: Full URL missing /api:', fullURL);
      console.error('   This request will fail!');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('❌ Network Error - No response from server');
      console.error('   URL:', error.config?.url);
      console.error('   Base URL:', error.config?.baseURL);
      console.error('   Full URL:', error.config?.baseURL + error.config?.url);
      console.error('   Error:', error.message);
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          ...error,
          response: {
            data: {
              message: 'Request timeout. The server is taking too long to respond. Please try again.'
            }
          }
        });
      }
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        return Promise.reject({
          ...error,
          response: {
            data: {
              message: 'CORS error: Unable to connect to backend. Please check backend CORS configuration.'
            }
          }
        });
      }
      
      return Promise.reject({
        ...error,
        response: {
          data: {
            message: `Unable to connect to server at ${error.config?.baseURL}. Please check if the backend is running.`
          }
        }
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - Clearing token and redirecting to login');
      storage.clear();
      window.location.href = '/login';
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      const message = error.response?.data?.message || 'Resource not found';
      console.error('❌ 404 Error:', message);
      console.error('   URL:', error.config?.url);
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('❌ Server Error:', error.response?.status);
      console.error('   Response:', error.response?.data);
    }

    // Log all errors
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;



