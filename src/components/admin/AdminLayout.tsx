import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearAuth } from '../../lib/auth';
import { getImageUrl } from '../../utils/imageUrl';
import { AdminBottomNav } from './AdminBottomNav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/dervora-control-9k2x/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-dervora-cream flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-dervora-beige shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Link to="/dervora-control-9k2x/dashboard" className="flex items-center gap-3">
            <img
              src={getImageUrl('images/logo-icon.png')}
              alt="Dervora"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="font-heading text-2xl font-bold text-dervora-primary block leading-none">
                Dervora
              </span>
              <span className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dervora-control-9k2x/dashboard"
              className="font-body text-sm text-dervora-dark hover:text-dervora-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/dervora-control-9k2x/ingredients"
              className="font-body text-sm text-dervora-dark hover:text-dervora-primary transition-colors"
            >
              Ingredients
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dervora-primary/10 text-dervora-primary font-body text-sm font-medium hover:bg-dervora-primary hover:text-dervora-cream transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-dervora-beige py-4 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="font-body text-xs text-dervora-dark/50">
            © 2026 Dervora Admin Panel — Internal Use Only
          </p>
        </div>
      </footer>

      <AdminBottomNav />
    </div>
  );
};