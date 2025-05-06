// "use client";

import { apiClient } from './client';
import { ENDPOINTS, STORAGE_KEYS } from './config';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  SignUpRequest, 
  SignUpResponse,
  GoogleLoginRequest,
  ForgotPasswordRequest
} from './types';

/**
 * Authentication service for managing user login, signup, etc.
 */
export class AuthService {
  /**
   * Login with email and password
   */
  public async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN, 
      data,
      false
    );

    if (response.success && response.data) {
      this.setAuthData(response.data);
    }

    return response;
  }

  /**
   * Login with Google
   */
  public async loginWithGoogle(data: GoogleLoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.GOOGLE_LOGIN, 
      data,
      false
    );

    if (response.success && response.data) {
      this.setAuthData(response.data);
    }

    return response;
  }

  /**
   * Sign up a new user
   */
  public async signUp(data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    const response = await apiClient.post<SignUpResponse>(
      ENDPOINTS.AUTH.SIGNUP, 
      data,
      false
    );

    if (response.success && response.data) {
      this.setAuthData(response.data);
    }

    return response;
  }

  /**
   * Request password reset
   */
  public async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD, 
      data,
      false
    );
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Optionally redirect to login page
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Get current user data
   */
  public getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      return null;
    }
  }

  /**
   * Save authentication data to localStorage
   */
  private setAuthData(data: LoginResponse | SignUpResponse): void {
    if (typeof window === 'undefined') return;

    const res = JSON.stringify(data);

    console.log('Setting auth data:', data); //shows response data
    console.log('Token:', data.token);  // undefined
    console.log('User:', data.user); // undefined
    console.log(JSON.stringify(data, null, 2))
    // console.log()
    
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(data.token));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

    console.log('Saved token:', localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
    console.log('Saved user:', localStorage.getItem(STORAGE_KEYS.USER));
  }
}

// Export a default instance
export const authService = new AuthService();