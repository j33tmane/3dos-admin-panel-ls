// Base API service with common functionality
import { ApiResponse, RequestConfig } from "@/types";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getBaseUrl();
  }

  private getBaseUrl(): string {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/v1";
    }
    return process.env.API_BASE_URL || "http://localhost:3001/v1";
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    const csrfToken = this.getCsrfToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(csrfToken && { "X-CSRF-Token": csrfToken }),
    };
  }

  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private getCsrfToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("csrf_token");
    }
    return null;
  }

  private setCsrfToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("csrf_token", token);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Extract CSRF token from response headers
    const csrfToken = response.headers.get("X-CSRF-Token");
    if (csrfToken) {
      this.setCsrfToken(csrfToken);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "Request failed",
        response.status,
        data.errors
      );
    }

    return data;
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = 10000 } = config;

    const url = `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    const requestHeaders = {
      ...this.getAuthHeaders(),
      ...headers,
    };

    // Don't set Content-Type for FormData - let browser set it with boundary
    if (body instanceof FormData) {
      delete requestHeaders["Content-Type"];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body
          ? body instanceof FormData
            ? body
            : JSON.stringify(body)
          : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError("Unknown error occurred", 500);
    }
  }

  // Convenience methods
  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }
}

// Custom error class
export class ApiError extends Error {
  public code: number;
  public errors?: string[];

  constructor(message: string, code: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.errors = errors;
  }
}

export const apiService = new ApiService();
