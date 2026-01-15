// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Properties endpoints
  PROPERTIES: `${API_BASE_URL}/api/properties`,
  PROPERTY_BY_ID: (id) => `${API_BASE_URL}/api/properties/${id}`,
  
  // Admin endpoints
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_PROPERTIES: `${API_BASE_URL}/api/admin/properties`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_PROPERTY_BY_ID: (id) => `${API_BASE_URL}/api/admin/properties/${id}`,
  ADMIN_USER_BY_ID: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
  ADMIN_PROPERTY_STATUS: (id) => `${API_BASE_URL}/api/admin/properties/${id}/status`,
  ADMIN_PROPERTY_FEATURED: (id) => `${API_BASE_URL}/api/admin/properties/${id}/featured`,
  
  // Wishlist endpoints (if needed in future)
  WISHLIST: `${API_BASE_URL}/api/wishlist`,
};

export default API_BASE_URL;
