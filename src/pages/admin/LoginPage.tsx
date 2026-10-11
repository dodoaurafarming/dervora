import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getImageUrl } from '../../utils/imageUrl';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect kalau sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dervora-control-9k2x/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Username dan password wajib diisi');
      return;
    }

    try {
      await login(username, password);
      toast.success('Login berhasil!');

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from || '/dervora-control-9k2x/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-dervora-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <img
              src={getImageUrl('images/logo-icon.png')}
              alt="Dervora"
              className="w-12 h-12"
            />
            <span className="font-heading text-3xl font-bold text-dervora-primary">
              Dervora
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-dervora-primary">
            Admin Panel
          </h1>
          <p className="font-body text-sm text-dervora-dark/60 mt-2">
            Masuk dengan kredensial admin
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-5"
        >
          {/* Username */}
          <div>
            <label className="block font-body text-sm font-medium text-dervora-dark mb-2">
              Username
            </label>
            <div className="relative">
              <UserIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dervora_admin"
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-dervora-dark"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block font-body text-sm font-medium text-dervora-dark mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-dervora-dark"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              'Memproses...'
            ) : (
              <>
                <LogIn size={18} className="inline mr-2" />
                Masuk
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center font-body text-xs text-dervora-dark/40 mt-6">
          © 2026 Dervora Admin Panel
        </p>
      </div>
    </div>
  );
};