import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from './config';
import { ApiResponse } from './types';

class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Base API client for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get auth token from storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Build request headers
   */
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make a request with timeout
   */
  private async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeout = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  /**
   * Generic request method
   */
  // private async request<T>(
  //   endpoint: string, 
  //   method: string, 
  //   data?: any, 
  //   requireAuth = true
  // ): Promise<ApiResponse<T>> {
  //   const url = `${this.baseUrl}${endpoint}`;

  //   const options: RequestInit = {
  //     method,
  //     headers: this.getHeaders(requireAuth),
  //   ...(requireAuth && { credentials: 'include' }), // Add credentials only if requireAuth is true

  //   };

  //   if (data) {
  //     options.body = JSON.stringify(data);
  //   }


  //   try {
  //     const response = await this.fetchWithTimeout(url, options);
  //     const responseData = await response.json();

  //     if (!response.ok) {
  //       throw new ApiError(
  //         responseData.error || 'An unknown error occurred',
  //         response.status
  //       );
  //     }

  //     return {
  //       success: true,
  //       data: responseData.data,
  //     };
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       return {
  //         success: false,
  //         error: error.message,
  //       };
  //     }

  //     if (error instanceof Error) {
  //       // Handle network errors, timeouts, etc.
  //       return {
  //         success: false,
  //         error: error.message || 'Network error',
  //       };
  //     }

  //     return {
  //       success: false,
  //       error: 'An unknown error occurred',
  //     };
  //   }
  // }


  private async request<T>(
  endpoint: string,
  method: string,
  data?: any,
  requireAuth = true
): Promise<ApiResponse<T>> {
  const url = `${this.baseUrl}${endpoint}`;

  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

  const headers: HeadersInit = requireAuth ? {} : { 'Content-Type': 'application/json' };
  if (!isFormData) {
    Object.assign(headers, this.getHeaders(requireAuth));
  } else if (requireAuth) {
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
    ...(requireAuth && { credentials: 'include' }),
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await this.fetchWithTimeout(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(
        responseData.error || responseData.message || 'An unknown error occurred',
        response.status
      );
    }

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

  /**
   * HTTP methods
   */
  public async get<T>(endpoint: string, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, requireAuth);
  }

  

  public async post<T>(endpoint: string, data: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, requireAuth);
  }

  public async put<T>(endpoint: string, data: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, requireAuth);
  }

  public async delete<T>(endpoint: string, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, requireAuth);
  }
}

// Export a default instance
export const apiClient = new ApiClient();