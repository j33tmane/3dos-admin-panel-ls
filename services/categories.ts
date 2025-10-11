// Categories service for handling category-related API calls
import { apiService } from "./api";
import {
  CategoriesResponse,
  CategoriesParams,
  CategoryDetailResponse,
  CategoryTreeResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ProductAssignment,
  CategoryStats,
} from "@/types";

class CategoriesService {
  /**
   * Fetch categories with pagination and filters
   */
  async getCategories(params: CategoriesParams = {}): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.name) queryParams.append("name", params.name);
    if (params.slug) queryParams.append("slug", params.slug);
    if (params.parent) queryParams.append("parent", params.parent);
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params.level) queryParams.append("level", params.level.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/v1/categories${queryString ? `?${queryString}` : ""}`;

    return apiService.get<CategoriesResponse>(endpoint);
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryById(categoryId: string): Promise<CategoryDetailResponse> {
    return apiService.get<CategoryDetailResponse>(`/v1/categories/${categoryId}`);
  }

  /**
   * Get category tree structure
   */
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    return apiService.get<CategoryTreeResponse>("/v1/categories/tree");
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<CategoryDetailResponse> {
    return apiService.post<CategoryDetailResponse>("/v1/categories", categoryData);
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    categoryId: string,
    categoryData: UpdateCategoryRequest
  ): Promise<CategoryDetailResponse> {
    return apiService.put<CategoryDetailResponse>(`/v1/categories/${categoryId}`, categoryData);
  }

  /**
   * Delete a category
   */
  async deleteCategory(categoryId: string): Promise<CategoriesResponse> {
    return apiService.delete<CategoriesResponse>(`/v1/categories/${categoryId}`);
  }

  /**
   * Assign products to a category
   */
  async assignProductsToCategory(assignment: ProductAssignment): Promise<CategoriesResponse> {
    return apiService.post<CategoriesResponse>(
      `/v1/categories/${assignment.categoryId}/products/assign`,
      { productIds: assignment.productIds }
    );
  }

  /**
   * Update product count for a category
   */
  async updateProductCount(categoryId: string, productCount: number): Promise<CategoriesResponse> {
    return apiService.post<CategoriesResponse>(
      `/v1/categories/${categoryId}/update-product-count`,
      { productCount }
    );
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<{ data: CategoryStats }> {
    return apiService.get<{ data: CategoryStats }>("/v1/categories/stats");
  }

  /**
   * Search categories
   */
  async searchCategories(query: string): Promise<CategoriesResponse> {
    return apiService.get<CategoriesResponse>(`/v1/categories/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get categories by level
   */
  async getCategoriesByLevel(level: number): Promise<CategoriesResponse> {
    return apiService.get<CategoriesResponse>(`/v1/categories/level/${level}`);
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryDetailResponse> {
    return apiService.get<CategoryDetailResponse>(`/v1/categories/slug/${slug}`);
  }

  /**
   * Get category path (breadcrumb)
   */
  async getCategoryPath(categoryId: string): Promise<{ data: string[] }> {
    return apiService.get<{ data: string[] }>(`/v1/categories/${categoryId}/path`);
  }

  /**
   * Get products in a category
   */
  async getCategoryProducts(categoryId: string, params: { page?: number; limit?: number } = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/v1/categories/${categoryId}/products${queryString ? `?${queryString}` : ""}`;

    return apiService.get<any>(endpoint);
  }
}

export const categoriesService = new CategoriesService();
