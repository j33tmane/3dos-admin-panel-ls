// Authentication service
import { apiService } from "./api";
import { SendOtpRequest, LoginRequest, AuthResponse } from "@/types";

class AuthService {
  async sendOtp(data: SendOtpRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>("/auth/send-otp", data);
  }

  async loginWithOtp(data: LoginRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>("/auth/login-with-otp", data);
  }

  async logout(): Promise<{ message: string }> {
    return apiService.post<{ message: string }>("/auth/logout");
  }

  async getCurrentUser(): Promise<{ user: any; authenticated: boolean }> {
    return apiService.get<{ user: any; authenticated: boolean }>("/auth/me");
  }

  // Client-side authentication methods
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const tokenExpires = this.getTokenExpiration("access");

    if (!token || !tokenExpires) return false;

    return !this.isTokenExpired(tokenExpires);
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  }

  getTokenExpiration(type: "access" | "refresh"): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`${type}_token_expires`);
    }
    return null;
  }

  setTokens(tokens: {
    access: { token: string; expires: string };
    refresh: { token: string; expires: string };
  }): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", tokens.access.token);
      localStorage.setItem("access_token_expires", tokens.access.expires);
      localStorage.setItem("refresh_token", tokens.refresh.token);
      localStorage.setItem("refresh_token_expires", tokens.refresh.expires);
    }
  }

  setUser(user: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getUser(): any | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("access_token_expires");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("refresh_token_expires");
      localStorage.removeItem("user");
    }
  }

  private isTokenExpired(tokenExpires: string): boolean {
    return new Date(tokenExpires) <= new Date();
  }

  // Debug methods
  debugStoredData(): void {
    if (typeof window !== "undefined") {
      console.log("🔍 Debug - Stored Authentication Data:");
      console.log("Access Token:", this.getAccessToken());
      console.log("Access Token Expires:", this.getTokenExpiration("access"));
      console.log("Refresh Token:", this.getRefreshToken());
      console.log("Refresh Token Expires:", this.getTokenExpiration("refresh"));
      console.log("User Data:", this.getUser());
      console.log("Is Authenticated:", this.isAuthenticated());
    }
  }
}

export const authService = new AuthService();
