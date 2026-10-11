import { useState, useCallback } from 'react';
import {
  saveAuth,
  getToken,
  getUser,
  clearAuth,
  isAuthenticated,
  type AdminUser,
} from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: AdminUser;
  };
  error?: {
    code: string;
    message: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(getUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as LoginResponse;

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || 'Login gagal');
      }

      saveAuth(data.data.token, data.data.user);
      setUser(data.data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    token: getToken(),
  };
}