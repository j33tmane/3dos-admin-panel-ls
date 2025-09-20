// User-related types for the admin panel

export interface User {
  id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: string;
  address: string;
  isEmailVerified: boolean;
  externalUrls: string[];
  createdAt: string;
  bio?: string;
  royalty: number;
  affiliateCode: string;
  modelLimit: number;
}

export interface UsersResponse {
  status: string;
  message: string;
  data: {
    results: User[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors?: any[];
}

export interface UserWallet {
  balance: number;
  currency: string;
  error?: string;
}

export interface UserDetails {
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
  bio?: string;
  firstName: string;
  lastName: string;
  modelLimit: number;
  aiCredits: number;
  aiCreditsCurrency: string;
  username: string;
  id: string;
  fullName: string;
  wallet: UserWallet;
}

export interface UserDetailsResponse {
  status: string;
  code: number;
  message: string;
  data: UserDetails;
  errors: any[];
}

export interface UpdateUserRoleRequest {
  email: string;
}

export interface UpdateUserRoleResponse {
  status: string;
  code: number;
  message: string;
  data: UserDetails;
  errors: any[];
}

export interface UsersParams {
  page?: number;
  limit?: number;
  role?: string;
  email?: string;
  name?: string;
  username?: string;
  sortBy?: string; // Format: "field:direction" (asc/desc)
}
