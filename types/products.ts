// Product-related types for the admin panel

export interface ProductImage {
  url: string;
  key: string;
  id: string;
}

export interface ProductUser {
  email: string;
  role: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
  fullName: string;
}

export interface ProductFile {
  url?: string;
  key?: string;
}

export interface ProductWalrus {
  storedEpoch: string | null;
}

export interface Product {
  walrus: ProductWalrus;
  manufacturingMethod: string;
  material: string;
  title: string;
  price: number;
  cardDescription: string;
  modelNotes: string;
  tags: string[];
  status: boolean;
  images: ProductImage[];
  user: ProductUser;
  unitsSold: number;
  isPrivate: boolean;
  isAiGenerated: boolean;
  createdAt: string;
  slug: string;
  activeOffer: any;
  id: string;
  file: ProductFile;
}

export interface ProductsResponse {
  status: string;
  code: number;
  message: string;
  data: {
    results: Product[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
  errors: any[];
}

export interface ProductsParams {
  page?: number;
  limit?: number;
  title?: string;
  material?: string;
  status?: boolean;
  isPrivate?: boolean;
  userId?: string;
  sortBy?: string; // Format: "field:direction" (asc/desc)
}
