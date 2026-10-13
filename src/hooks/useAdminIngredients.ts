import { useState, useEffect, useCallback } from 'react';
import {
  adminListIngredients,
  isApiSuccess,
  type AdminIngredient,
} from '../lib/api';

interface UseAdminIngredientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useAdminIngredients(params?: UseAdminIngredientsParams) {
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null>(null);

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await adminListIngredients(params);

    if (isApiSuccess(response)) {
      setIngredients(response.data);
      setMeta(response.meta);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, [params?.page, params?.limit, params?.search]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return { ingredients, loading, error, meta, refetch: fetchIngredients };
}

/**
 * Hook simple untuk fetch all ingredients (drop-down, picker).
 */
export function useSimpleIngredients() {
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await adminListIngredients({ limit: 100 });
    if (isApiSuccess(response)) {
      setIngredients(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ingredients, loading, error, refetch: fetchData };
}