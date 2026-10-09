import { useState, useEffect } from 'react';
import { getProducts, getProductById, isApiSuccess, type Product } from '../lib/api';

interface UseProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
}

export function useProducts(params?: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      const response = await getProducts(params);

      if (cancelled) return;

      if (isApiSuccess(response)) {
        setProducts(response.data);
        setMeta(response.meta);
      } else {
        setError(response.error.message);
      }
      setLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [params?.page, params?.limit, params?.search, params?.categoryId]);

  return { products, loading, error, meta };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      const response = await getProductById(id!);

      if (cancelled) return;

      if (isApiSuccess(response)) {
        setProduct(response.data);
      } else {
        setError(response.error.message);
      }
      setLoading(false);
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}