import { useState, useEffect, useCallback } from 'react';
import { getBrands, isApiSuccess, type Brand } from '../lib/api';

export function useAdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getBrands({ limit: 100 });

    if (isApiSuccess(response)) {
      setBrands(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, error, refetch: fetchBrands };
}