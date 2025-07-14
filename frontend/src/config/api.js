// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:3000'
  },
  // Production environment
  production: {
    baseURL: '' // Will use same domain as frontend
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'production';

// Export the base URL for the current environment
export const API_BASE_URL = API_CONFIG[environment]?.baseURL || API_CONFIG.development.baseURL;
console.log('ENV MODE:', import.meta.env.MODE, 'API_BASE_URL:', API_BASE_URL);

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_CONFIG; 