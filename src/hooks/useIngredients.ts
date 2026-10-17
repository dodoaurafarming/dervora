import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getIngredients,
  getIngredientCatalog,
  getCatalogDetail,
  isApiSuccess,
  type Ingredient,
  type IngredientCatalog,
  type CatalogDetail,
} from '../lib/api';
import { useDebounce } from './useDebounce';

// ==================== INGREDIENTS (technical — untuk relasi produk) ====================
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

// ==================== INGREDIENT CATALOG (Fase 5 — BARU) ====================
/**
 * Hook untuk list catalog + search + filter kategori.
 * Pakai debounce untuk search (300ms) supaya tidak spam API.
 */
export function useIngredientCatalog() {
  const [catalog, setCatalog] = useState<IngredientCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getIngredientCatalog();

    if (isApiSuccess(response)) {
      setCatalog(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter client-side (search + category)
  const filtered = useMemo(() => {
    let result = catalog;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    return result;
  }, [catalog, debouncedSearch, categoryFilter]);

  // Daftar kategori unik (untuk dropdown filter)
  const categories = useMemo(() => {
    const cats = new Set(catalog.map((c) => c.category).filter(Boolean));
    return Array.from(cats).sort() as string[];
  }, [catalog]);

  return {
    catalog: filtered,
    totalCount: catalog.length,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    refetch: fetchData,
  };
}

/**
 * Hook untuk detail catalog by ID + list produk terkait.
 */
export function useCatalogDetail(id: number | string | undefined) {
  const [detail, setDetail] = useState<CatalogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined || id === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      const response = await getCatalogDetail(id!);

      if (cancelled) return;

      if (isApiSuccess(response)) {
        setDetail(response.data);
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

  return { detail, loading, error };
}