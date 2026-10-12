import { useState, useEffect, useCallback } from 'react';
import { getIngredients, isApiSuccess, type Ingredient } from '../lib/api';

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

  return { ingredients, loading, error, refetch: fetchData };
}

export function useIngredientById(id: number | null) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
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

      // Karena endpoint detail ingredient by ID mungkin belum ada,
      // kita fetch semua ingredients dan filter by ID.
      // Nanti kita bisa upgrade pakai GET /api/ingredients/:id
      const response = await getIngredients();

      if (cancelled) return;

      if (isApiSuccess(response)) {
        const found = response.data.find((i) => i.id === id);
        if (found) {
          setIngredient(found);
        } else {
          setError('Ingredient tidak ditemukan');
        }
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

  return { ingredient, loading, error };
}