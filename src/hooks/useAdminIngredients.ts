import { useState, useEffect, useCallback } from 'react';
import { getIngredients, isApiSuccess, type Ingredient } from '../lib/api';

export function useAdminIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getIngredients();

    if (isApiSuccess(response)) {
      setIngredients(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return { ingredients, loading, error, refetch: fetchIngredients };
}