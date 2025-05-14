// API Configuration
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api/v1`;

// Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    GOOGLE_LOGIN: '/auth/google',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },

  CLASSROOMS: {
    GET_ALL: "/classrooms/getClassrooms", // Make sure path starts with a slash
    POST_ANNOUNCEMENT: "/classrooms/postAnnouncement",
    GET_ANNOUNCEMENTS: "/classrooms/getAnnouncements",
    CREATE: "/classrooms/create",

  },
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 100000;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'learn_flo_auth_token',
  USER: 'learn_flo_user',
};