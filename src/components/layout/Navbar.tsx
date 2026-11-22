import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isLoading, loginWithGoogle } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Ingredients', path: '/ingredients' },
    { name: 'My Routine', path: '/my-routine' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-dervora-cream p-4 shadow-dervora">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={getImageUrl('images/logo-icon.png')}
          alt="Dervora Logo"
          className="w-12 h-12 object-contain"
        />
        <span className="font-heading text-3xl font-bold text-dervora-primary tracking-wide">
          Dervora
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`pb-1 font-heading text-lg font-medium ${
                  isActive
                    ? 'text-dervora-primary border-b-2 border-dervora-primary'
                    : 'text-dervora-dark hover:text-dervora-primary-dark transition-colors'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <NotificationDropdown />

          {isLoading ? (
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/60 border border-dervora-beige hover:border-dervora-primary hover:shadow-sm transition-all duration-300"
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name || 'Profile'}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-dervora-primary/10 flex items-center justify-center text-dervora-primary">
                  <User size={18} />
                </div>
              )}
              <span className="hidden md:block font-body text-sm font-semibold text-dervora-dark">
                {user.name?.split(' ')[0] || 'User'}
              </span>
            </Link>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="font-heading text-lg font-semibold px-6 py-2.5 bg-dervora-primary text-dervora-cream rounded-full hover:bg-dervora-primary-dark transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};