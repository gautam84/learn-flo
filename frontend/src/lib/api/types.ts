import { User } from "../common/types";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface GoogleLoginRequest {
  token: string;
  userType: 'STUDENT' | 'TEACHER';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  id: string; // Student ID or Teacher ID
  userType: 'student' | 'teacher';
}

export interface SignUpResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: 'STUDENT' | 'TEACHER';
  };
}