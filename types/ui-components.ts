// UI Components types for the admin panel

export interface UIComponent {
  id: string;
  image: {
    url: string;
    key: string;
  };
  title: string;
  subtitle?: string;
  actionUrl?: string;
  status: boolean;
  sortOrder: number;
  componentType: "slider" | "banner" | "card";
  createdAt: string;
  updatedAt: string;
}

export interface UIComponentsResponse {
  status: string;
  message: string;
  data: {
    results: UIComponent[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors?: any[];
}

export interface UIComponentResponse {
  status: string;
  message: string;
  data: UIComponent;
  errors?: any[];
}

export interface CreateUIComponentRequest {
  image: File;
  title: string;
  subtitle?: string;
  actionUrl?: string;
  status?: boolean;
  sortOrder?: number;
  componentType?: "slider" | "banner" | "card";
}

export interface UpdateUIComponentRequest {
  image?: File;
  title?: string;
  subtitle?: string;
  actionUrl?: string;
  status?: boolean;
  sortOrder?: number;
  componentType?: "slider" | "banner" | "card";
}

export interface UIComponentsParams {
  name?: string;
  componentType?: "slider" | "banner" | "card";
  status?: boolean;
  sortBy?: string;
  limit?: number;
  page?: number;
}
