// UI Components service for handling UI component-related API calls
import { apiService } from "./api";
import {
  UIComponentsResponse,
  UIComponentsParams,
  UIComponentResponse,
  CreateUIComponentRequest,
  UpdateUIComponentRequest,
} from "@/types";
import { ApiResponse } from "@/types/api";

class UIComponentsService {
  /**
   * Create a new UI component with image upload
   */
  async createUIComponent(
    data: CreateUIComponentRequest
  ): Promise<UIComponentResponse> {
    const formData = new FormData();

    // Append file
    if (data.image) {
      formData.append("image", data.image, data.image.name);
    }

    // Append other fields
    formData.append("title", data.title);
    if (data.subtitle) formData.append("subtitle", data.subtitle);
    if (data.actionUrl) formData.append("actionUrl", data.actionUrl);
    if (data.status !== undefined)
      formData.append("status", data.status.toString());
    if (data.sortOrder !== undefined)
      formData.append("sortOrder", data.sortOrder.toString());
    if (data.componentType)
      formData.append("componentType", data.componentType);

    const response: ApiResponse<UIComponentResponse> =
      await apiService.post<UIComponentResponse>("/ui-components", formData);

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Fetch UI components with pagination and filters
   */
  async getUIComponents(
    params: UIComponentsParams = {}
  ): Promise<UIComponentsResponse> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Filters
    if (params.name) queryParams.append("name", params.name);
    if (params.componentType)
      queryParams.append("componentType", params.componentType);
    if (params.status !== undefined)
      queryParams.append("status", params.status.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `/ui-components${queryString ? `?${queryString}` : ""}`;

    const response: ApiResponse<UIComponentsResponse> =
      await apiService.get<UIComponentsResponse>(endpoint);

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
    } as UIComponentsResponse;
  }

  /**
   * Get a specific UI component by ID
   */
  async getUIComponentById(componentId: string): Promise<UIComponentResponse> {
    const response: ApiResponse<UIComponentResponse> =
      await apiService.get<UIComponentResponse>(
        `/ui-components/${componentId}`
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Update an existing UI component
   */
  async updateUIComponent(
    componentId: string,
    data: UpdateUIComponentRequest
  ): Promise<UIComponentResponse> {
    const formData = new FormData();

    // Append file if provided
    if (data.image) formData.append("image", data.image);

    // Append other fields if provided
    if (data.title) formData.append("title", data.title);
    if (data.subtitle !== undefined) formData.append("subtitle", data.subtitle);
    if (data.actionUrl !== undefined)
      formData.append("actionUrl", data.actionUrl);
    if (data.status !== undefined)
      formData.append("status", data.status.toString());
    if (data.sortOrder !== undefined)
      formData.append("sortOrder", data.sortOrder.toString());
    if (data.componentType)
      formData.append("componentType", data.componentType);

    const response: ApiResponse<UIComponentResponse> =
      await apiService.patch<UIComponentResponse>(
        `/ui-components/${componentId}`,
        formData
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Delete a UI component
   */
  async deleteUIComponent(componentId: string): Promise<UIComponentResponse> {
    const response: ApiResponse<UIComponentResponse> =
      await apiService.delete<UIComponentResponse>(
        `/ui-components/${componentId}`
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }

  /**
   * Get active UI components by type (public endpoint)
   */
  async getActiveComponentsByType(
    type: "slider" | "banner" | "card"
  ): Promise<UIComponentResponse> {
    const response: ApiResponse<UIComponentResponse> =
      await apiService.get<UIComponentResponse>(
        `/ui-components/active/${type}`
      );

    return {
      status: response.status,
      message: response.message,
      data: response.data || ({} as any),
      errors: response.errors || [],
    };
  }
}

export const uiComponentsService = new UIComponentsService();
