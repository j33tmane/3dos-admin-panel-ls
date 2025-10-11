// Category-related TypeScript interfaces

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
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
  semanticKeywords1?: string[];
  semanticKeywords2?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  children?: CategoryTreeNode[];
  isActive: boolean;
  productCount: number;
  level: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parent: string | null;
  isActive: boolean;
  sortOrder: number;
  image: {
    url: string;
    key: string;
  };
  seoTitle: string;
  seoDescription: string;
  semanticKeywords1: string[];
  semanticKeywords2: string[];
}

export interface ProductAssignment {
  categoryId: string;
  productIds: string[];
}

export interface CategoriesResponse {
  status: string;
  code: number;
  message: string;
  data: {
    results: Category[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors: any[];
}

export interface CategoryTreeResponse {
  status: string;
  code: number;
  message: string;
  data: CategoryTreeNode[];
  errors: any[];
}

export interface CategoryDetailResponse {
  status: string;
  code: number;
  message: string;
  data: Category;
  errors: any[];
}

export interface CategoriesParams {
  page?: number;
  limit?: number;
  name?: string;
  slug?: string;
  parent?: string;
  isActive?: boolean;
  level?: number;
  sortBy?: string; // Format: "field:direction" (asc/desc)
  search?: string; // General search across name, description, slug
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  image?: {
    url: string;
    key: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  semanticKeywords1?: string[];
  semanticKeywords2?: string[];
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parent?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  image?: {
    url: string;
    key: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  semanticKeywords1?: string[];
  semanticKeywords2?: string[];
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  categoriesWithProducts: number;
  averageProductsPerCategory: number;
  topCategories: Array<{
    categoryId: string;
    name: string;
    productCount: number;
  }>;
}
