const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ==================== TYPES ====================
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ==================== TYPE GUARDS ====================
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.success === false;
}

// ==================== DOMAIN TYPES ====================
export interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
  country: string | null;
  website: string | null;
  reputation: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
}

export interface Ingredient {
  id: number;
  name: string;
  function: string | null;
  description: string | null;
  suitableSkin: string[] | null;
  concerns: string[] | null;
  photoUrl: string | null;
  sourceLink: string | null;
}

export interface ProductIngredient {
  productId: number;
  ingredientId: number;
  ingredient: Ingredient;
}

export interface Product {
  id: number;
  name: string;
  brandId: number;
  categoryId: number | null;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  bpom: string | null;
  size: string | null;
  halal: boolean | null;
  rating: number | null;
  reviewCount: number | null;
  howToUse: string | null;
  notes: string | null;
  skinTypes: string[] | null;
  concerns: string[] | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category | null;
  ingredients: ProductIngredient[];
}

// ==================== HELPER ====================
async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
        details: null,
      },
    };
  }
}

// ==================== PRODUCTS API ====================
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}): Promise<ApiResponse<Product[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.categoryId) query.set('categoryId', String(params.categoryId));

  const qs = query.toString();
  return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function getProductById(id: number): Promise<ApiResponse<Product>> {
  return request<Product>(`/api/products/${id}`);
}

// ==================== BRANDS API ====================
export async function getBrands(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Brand[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return request<Brand[]>(`/api/brands${qs ? `?${qs}` : ''}`);
}

// ==================== CATEGORIES API ====================
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return request<Category[]>('/api/categories');
}

// ==================== INGREDIENTS API ====================
export async function getIngredients(): Promise<ApiResponse<Ingredient[]>> {
  return request<Ingredient[]>('/api/ingredients');
}