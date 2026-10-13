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
  photoPublicId: string | null;  // ← PASTIKAN INI ADA
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
  imagePublicId: string | null;
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
async function authFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('dervora_admin_token');

  return request<T>(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

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

// ==================== ADMIN BRANDS API ====================
export async function adminCreateBrand(data: {
  name: string;
  country?: string;
  website?: string;
}): Promise<ApiResponse<Brand>> {
  return authFetch<Brand>('/api/brands', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// ==================== CATEGORIES API ====================
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return request<Category[]>('/api/categories');
}

export async function adminCreateCategory(data: {
  name: string;
  description?: string;
  iconUrl?: string;
}): Promise<ApiResponse<Category>> {
  return authFetch<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== INGREDIENTS API ====================
export async function getIngredients(): Promise<ApiResponse<Ingredient[]>> {
  return request<Ingredient[]>('/api/ingredients');
}

// ==================== ADMIN API ====================
export interface AdminStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  totalIngredients: number;
  deletedProducts: number;
}

export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  return authFetch<AdminStats>('/api/admin/stats');
}

// ==================== ADMIN PRODUCTS API ====================
export async function adminListProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}): Promise<ApiResponse<Product[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.includeDeleted) query.set('includeDeleted', 'true');

  const qs = query.toString();
  return authFetch<Product[]>(`/api/admin/products${qs ? `?${qs}` : ''}`);
}

export async function adminGetProduct(id: number): Promise<ApiResponse<Product>> {
  return authFetch<Product>(`/api/admin/products/${id}`);
}

export async function adminCreateProduct(
  data: Partial<Product> & { ingredientIds?: number[] }
): Promise<ApiResponse<Product>> {
  return authFetch<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(
  id: number,
  data: Partial<Product> & { ingredientIds?: number[] }
): Promise<ApiResponse<Product>> {
  return authFetch<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(id: number): Promise<ApiResponse<{ id: number; deleted: boolean }>> {
  return authFetch<{ id: number; deleted: boolean }>(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

export async function adminRestoreProduct(id: number): Promise<ApiResponse<Product>> {
  return authFetch<Product>(`/api/admin/products/${id}/restore`, {
    method: 'POST',
  });
}

// ==================== ADMIN UPLOAD API ====================
export async function adminUploadImage(
  file: File
): Promise<ApiResponse<{ url: string; publicId: string }>> {
  const token = localStorage.getItem('dervora_admin_token');
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const json = await res.json();
    return json as ApiResponse<{ url: string; publicId: string }>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Upload failed',
        details: null,
      },
    };
  }
}

// ==================== ADMIN INGREDIENTS API ====================
export interface AdminIngredient extends Ingredient {
  _count?: {
    products: number;
  };
}

export async function adminListIngredients(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<AdminIngredient[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return authFetch<AdminIngredient[]>(`/api/admin/ingredients${qs ? `?${qs}` : ''}`);
}

export async function adminGetIngredient(id: number): Promise<ApiResponse<AdminIngredient>> {
  return authFetch<AdminIngredient>(`/api/admin/ingredients/${id}`);
}

export async function adminCreateIngredient(
  data: Partial<AdminIngredient>
): Promise<ApiResponse<AdminIngredient>> {
  return authFetch<AdminIngredient>('/api/admin/ingredients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateIngredient(
  id: number,
  data: Partial<AdminIngredient>
): Promise<ApiResponse<AdminIngredient>> {
  return authFetch<AdminIngredient>(`/api/admin/ingredients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteIngredient(
  id: number
): Promise<ApiResponse<{ id: number; deleted: boolean }>> {
  return authFetch<{ id: number; deleted: boolean }>(`/api/admin/ingredients/${id}`, {
    method: 'DELETE',
  });
}

export async function adminUploadIngredientImage(
  file: File
): Promise<ApiResponse<{ url: string; publicId: string }>> {
  const token = localStorage.getItem('dervora_admin_token');
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`${API_URL}/api/admin/upload/ingredient`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    const json = await res.json();
    return json as ApiResponse<{ url: string; publicId: string }>;
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Upload failed',
        details: null,
      },
    };
  }
}