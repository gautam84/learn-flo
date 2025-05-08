import { User } from "../common/types";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
  username: string;
  role: 'STUDENT' | 'TEACHER';
}

export interface SignUpResponse {
  token: string;
  user: User;
}