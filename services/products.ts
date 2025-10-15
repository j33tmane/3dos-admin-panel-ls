// Products service for handling product-related API calls
import { apiService } from "./api";
import {
  ProductsResponse,
  ProductsParams,
  ArchiveProductResponse,
} from "@/types";
import { ApiResponse } from "@/types/api";

class ProductsService {
  /**
   * Fetch products with pagination and filters
   */
  async getProducts(params: ProductsParams = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.title) queryParams.append("title", params.title);
    if (params.material) queryParams.append("material", params.material);
    if (params.status !== undefined)
      queryParams.append("status", params.status.toString());
    if (params.isPrivate !== undefined)
      queryParams.append("isPrivate", params.isPrivate.toString());
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.categoryId) queryParams.append("category", params.categoryId);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/models/admin/list/all${
      queryString ? `?${queryString}` : ""
    }`;

    return apiService.get<ProductsResponse>(endpoint);
  }

  /**
   * Get a specific product by ID
   */
  async getProductById(productId: string): Promise<ProductsResponse> {
    return apiService.get<ProductsResponse>(`/models/admin/${productId}`);
  }

  /**
   * Update product status
   */
  async updateProductStatus(
    productId: string,
    status: boolean
  ): Promise<ProductsResponse> {
    return apiService.patch<ProductsResponse>(
      `/models/admin/${productId}/status`,
      {
        status,
      }
    );
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<ProductsResponse> {
    return apiService.delete<ProductsResponse>(`/models/admin/${productId}`);
  }

  /**
   * Archive a product
   */
  async archiveProduct(modelId: string): Promise<ArchiveProductResponse> {
    const response: ApiResponse<{
      modelId: string;
      title: string;
      status: boolean;
      archivedAt: string;
    }> = await apiService.post<{
      modelId: string;
      title: string;
      status: boolean;
      archivedAt: string;
    }>(`/admin/listings/${modelId}/archive`, {});

    // Transform the response to match our expected format
    return {
      status: response.status,
      code: response.code,
      message: response.message,
      data: response.data || {
        modelId: "",
        title: "",
        status: false,
        archivedAt: "",
      },
      errors: response.errors,
    };
  }

  /**
   * Get products statistics
   */
  async getProductsStats(): Promise<ProductsResponse> {
    return apiService.get<ProductsResponse>("/models/admin/stats");
  }
}

export const productsService = new ProductsService();
