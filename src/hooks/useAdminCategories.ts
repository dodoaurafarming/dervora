import { useState, useEffect, useCallback } from 'react';
import { getCategories, isApiSuccess, type Category } from '../lib/api';

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getCategories();

    if (isApiSuccess(response)) {
      setCategories(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}