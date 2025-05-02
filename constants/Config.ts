// API configuration
export const API_BASE_URL = 'http://192.168.0.4:5000/api/v1'; // For Android emulator
// export const API_BASE_URL = 'http://localhost:5000/api/v1'; // For web
// export const API_BASE_URL = 'http://YOUR_LOCAL_IP:5000/api/v1'; // For physical device (replace with your computer's IP)

// API Configuration
export const API_URL = 'http://192.168.0.4:5000/api/v1';

// App Configuration
export const APP_NAME = 'Farm Direct';
export const APP_VERSION = '1.0.0';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  UPDATE_DETAILS: `${API_BASE_URL}/auth/updatedetails`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/updatepassword`,
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
}; 