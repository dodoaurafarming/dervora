import { useState, useEffect, useCallback } from 'react';
import { getAdminStats, isApiSuccess, type AdminStats } from '../lib/api';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getAdminStats();

    if (isApiSuccess(response)) {
      setStats(response.data);
    } else {
      setError(response.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}