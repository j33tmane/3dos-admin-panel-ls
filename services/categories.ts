// Categories service for handling category-related API calls
import { apiService } from "./api";
import {
  CategoriesResponse,
  CategoriesParams,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  AssignProductRequest,
  AssignProductResponse,
} from "@/types";
import { ApiResponse } from "@/types/api";

class CategoriesService {
  /**
   * Fetch categories with pagination and filters
   */
  async getCategories(
    params: CategoriesParams = {}
  ): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.name) queryParams.append("name", params.name);
    if (params.parent) queryParams.append("parent", params.parent);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params.level !== undefined)
      queryParams.append("level", params.level.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.populate) queryParams.append("populate", params.populate);

    const queryString = queryParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ""}`;

    const response: ApiResponse<CategoriesResponse> =
      await apiService.get<CategoriesResponse>(endpoint);

    return {
      status: response.status,
      message: response.message,
      data: response.data || {
        results: [],
        page: 1,
        limit: 10,
        totalPages: 0,
        totalResults: 0,
      },
      errors: response.errors,
    } as CategoriesResponse;
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryById(categoryId: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> =
      await apiService.get<CategoryResponse>(`/categories/${categoryId}`);

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> =
      await apiService.post<CategoryResponse>("/categories", data);

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> =
      await apiService.put<CategoryResponse>(`/categories/${categoryId}`, data);

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Delete a category
   */
  async deleteCategory(
    categoryId: string,
    force: boolean = false
  ): Promise<CategoryResponse> {
    const queryParams = new URLSearchParams();
    if (force) queryParams.append("force", "true");

    const queryString = queryParams.toString();
    const endpoint = `/categories/${categoryId}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: ApiResponse<CategoryResponse> =
      await apiService.delete<CategoryResponse>(endpoint);

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Assign a product to a category
   */
  async assignProductToCategory(
    categoryId: string,
    data: AssignProductRequest
  ): Promise<AssignProductResponse> {
    const response: ApiResponse<AssignProductResponse> =
      await apiService.post<AssignProductResponse>(
        `/categories/${categoryId}/products/assign`,
        data
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Update product count for a category
   */
  async updateProductCount(categoryId: string): Promise<CategoryResponse> {
    const response: ApiResponse<CategoryResponse> =
      await apiService.post<CategoryResponse>(
        `/categories/${categoryId}/update-product-count`
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Get categories statistics
   */
  async getCategoriesStats(): Promise<CategoriesResponse> {
    const response: ApiResponse<CategoriesResponse> =
      await apiService.get<CategoriesResponse>("/categories/stats");

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
    } as CategoriesResponse;
  }
}

export const categoriesService = new CategoriesService();
