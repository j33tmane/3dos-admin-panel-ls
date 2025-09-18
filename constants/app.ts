// Application constants and configuration

export const APP_CONFIG = {
  name: "3DOS Admin Panel",
  version: "1.0.0",
  description: "Modern admin dashboard built with Next.js and shadcn/ui",
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/v1",
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",

  // Management routes
  USERS: "/users",
  PRODUCTS: "/products",
  ORDERS: "/orders",

  // Settings routes
  SETTINGS: "/settings",
  ORGANIZATION: "/organization",
  ACCOUNT: "/account",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  ACCESS_TOKEN_EXPIRES: "access_token_expires",
  REFRESH_TOKEN: "refresh_token",
  REFRESH_TOKEN_EXPIRES: "refresh_token_expires",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP_LENGTH: 6,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;
