// Category-related types for the admin panel

export interface Category {
  _id?: string; // MongoDB ObjectId (preferred)
  id?: string; // Alternative ID field
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  ancestors: string[];
  categoryPath: string[];
  isActive: boolean;
  sortOrder: number;
  level: number;
  productCount: number;
  image?: {
    url: string;
    key: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
  semanticKeywords1?: string[];
  semanticKeywords2?: string[];
  createdAt: string;
  updatedAt: string;
  fullPath?: string;
  urlPath?: string;
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: {
    results: Category[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors?: any[];
}

export interface CategoryResponse {
  status: string;
  message: string;
  data: Category;
  errors?: any[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent?: string;
  isActive?: boolean;
  sortOrder?: number;
  image?: {
    url: string;
    key: string;
  };
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parent?: string;
  isActive?: boolean;
  sortOrder?: number;
  image?: {
    url: string;
    key: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoSlug?: string;
}

export interface AssignProductRequest {
  productId: string;
}

export interface AssignProductResponse {
  status: string;
  message: string;
  data: {
    productId: string;
    categoryId: string;
    categoryName: string;
  };
  errors?: any[];
}

export interface CategoriesParams {
  page?: number;
  limit?: number;
  name?: string;
  parent?: string;
  isActive?: boolean;
  level?: number;
  sortBy?: string; // Format: "field:direction" (asc/desc)
  populate?: string;
}
