// Common type definitions

// User roles
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
 }

// Basic user type
export interface User {
  id: string;
  email: string;
  username: string;
  role: "STUDENT" | "TEACHER";
}

// API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// // Pagination params
// export interface PaginationParams {
//   page?: number;
//   limit?: number;
// }

// // Pagination result
// export interface PaginatedResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }