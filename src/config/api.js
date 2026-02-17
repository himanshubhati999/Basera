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
  ADMIN_PROPERTY_PUBLISHED: (id) => `${API_BASE_URL}/api/admin/properties/${id}/published`,
  
  // Wishlist endpoints (if needed in future)
  WISHLIST: `${API_BASE_URL}/api/wishlist`,
  
  // Consult endpoints
  CONSULTS: `${API_BASE_URL}/api/consults`,
  CONSULT_BY_ID: (id) => `${API_BASE_URL}/api/consults/${id}`,
  CONSULT_STATUS: (id) => `${API_BASE_URL}/api/consults/${id}/status`,
  CONSULT_STATS: `${API_BASE_URL}/api/consults/stats`,
  
  // Consult Fields endpoints
  CONSULT_FIELDS: `${API_BASE_URL}/api/consult-fields`,
  CONSULT_FIELDS_ACTIVE: `${API_BASE_URL}/api/consult-fields/active`,
  CONSULT_FIELD_BY_ID: (id) => `${API_BASE_URL}/api/consult-fields/${id}`,
  
  // Pages endpoints
  PAGES: `${API_BASE_URL}/api/pages`,
  PAGES_PUBLISHED: `${API_BASE_URL}/api/pages/published`,
  PAGE_BY_ID: (id) => `${API_BASE_URL}/api/pages/${id}`,
  PAGE_BY_SLUG: (slug) => `${API_BASE_URL}/api/pages/slug/${slug}`,
  PAGE_STATUS: (id) => `${API_BASE_URL}/api/pages/${id}/status`,
  PAGES_BULK_DELETE: `${API_BASE_URL}/api/pages/bulk-delete`,
  
  // Upload endpoints
  UPLOAD_SINGLE: `${API_BASE_URL}/api/upload/single`,
  UPLOAD_MULTIPLE: `${API_BASE_URL}/api/upload/multiple`,
  DELETE_IMAGE: `${API_BASE_URL}/api/upload/delete`,
  
  // Review endpoints
  PROPERTY_REVIEWS: (propertyId) => `${API_BASE_URL}/api/reviews/property/${propertyId}`,
  CREATE_REVIEW: (propertyId) => `${API_BASE_URL}/api/reviews/property/${propertyId}`,
  UPDATE_REVIEW: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}`,
};

export default API_BASE_URL;
