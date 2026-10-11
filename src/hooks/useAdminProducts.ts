import { useState, useEffect, useCallback } from 'react';
import {
  adminListProducts,
  isApiSuccess,
  type Product,
} from '../lib/api';

interface UseAdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
}

export function useAdminProducts(params?: UseAdminProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await adminListProducts(params);

    if (isApiSuccess(response)) {
      setProducts(response.data);
      setMeta(response.meta);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, [params?.page, params?.limit, params?.search, params?.includeDeleted]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    meta,
    refetch: fetchProducts,
  };
}