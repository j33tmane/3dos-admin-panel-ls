// Users service for handling user-related API calls
import { apiService } from "./api";
import {
  UsersResponse,
  UsersParams,
  UserDetailsResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from "@/types";
import { ApiResponse } from "@/types/api";

class UsersService {
  /**
   * Fetch users with pagination and filters
   */
  async getUsers(params: UsersParams = {}): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.role) queryParams.append("role", params.role);
    if (params.email) queryParams.append("email", params.email);
    if (params.name) queryParams.append("name", params.name);
    if (params.username) queryParams.append("username", params.username);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/users/admin/all${queryString ? `?${queryString}` : ""}`;

    const response: ApiResponse<UsersResponse> =
      await apiService.get<UsersResponse>(endpoint);

    // Transform the response to match our expected format
    return {
      status: response.status,
      message: response.message,
      data: response.data || {
        results: [],
        page: 1,
        limit: 20,
        totalPages: 0,
        totalResults: 0,
      },
      errors: response.errors,
    } as UsersResponse;
  }

  /**
   * Get users statistics
   */
  async getUsersStats(): Promise<UsersResponse> {
    const response: ApiResponse<UsersResponse> =
      await apiService.get<UsersResponse>("/users/admin/stats");

    return {
      status: response.status,
      message: response.message,
      data: response.data || {
        results: [],
        page: 1,
        limit: 1,
        totalPages: 1,
        totalResults: 0,
      },
      errors: response.errors,
    } as UsersResponse;
  }

  /**
   * Fetch user details by UID
   */
  async getUserDetails(uid: string): Promise<UserDetailsResponse> {
    const response: ApiResponse<UserDetailsResponse> =
      await apiService.get<UserDetailsResponse>(`/users/${uid}`);

    return {
      status: response.status,
      code: response.code,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Get user details by userId (new endpoint that returns CSRF token)
   */
  async getUserById(userId: string): Promise<UserDetailsResponse> {
    const response: ApiResponse<UserDetailsResponse> =
      await apiService.get<UserDetailsResponse>(`/users/${userId}`);

    return {
      status: response.status,
      code: response.code,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Update user role to manufacturer
   */
  async updateUserRoleToManufacturer(
    request: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleResponse> {
    const response: ApiResponse<UpdateUserRoleResponse> =
      await apiService.patch<UpdateUserRoleResponse>(
        "/users/role/manufacturer",
        request
      );

    return {
      status: response.status,
      code: response.code,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }
}

export const usersService = new UsersService();
