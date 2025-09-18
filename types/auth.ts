// Authentication related types and interfaces

export interface User {
  uid: string;
  email: string;
  address: string;
  role: string;
  isEmailVerified: boolean;
  externalUrls: string[];
  createdAt: string;
  affiliateCode: string;
  royalty: number;
  tigerbeetleAccountId: string;
  bio: string;
  firstName: string;
  lastName: string;
  modelLimit: number;
  aiCredits: number;
  aiCreditsCurrency: string;
  id: string;
  fullName: string;
}

export interface Tokens {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}

export interface AuthResponse {
  status: string;
  code: number;
  message: string;
  data: {
    success: boolean;
    tokens: Tokens;
    user: User;
  } | null;
  errors: string[];
}

export interface ErrorResponse {
  status: string;
  code: number;
  message: string;
  data: null;
  errors: string[];
}

export interface LoginRequest {
  email: string;
  otp: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
