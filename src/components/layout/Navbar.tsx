import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = false;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Ingredients', path: '/ingredients' },
    { name: 'My Routine', path: '/my-routine' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-dervora-cream p-4 shadow-dervora">
      {/* Kiri: Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img 
          src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
          alt="Dervora Logo" 
          className="w-12 h-12 object-contain" 
        />
        <span className="font-heading text-3xl font-bold text-dervora-primary tracking-wide">
          Dervora
        </span>
      </Link>

      {/* Kanan: Menu Desktop & Actions */}
      <div className="flex items-center gap-8">
        
        {/* Menu Desktop */}
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-dervora-dark focus:outline-none hover:text-dervora-primary transition-colors">
            <Bell size={20} />
          </button>

          {isLoggedIn ? (
            <Link to="/profile">
              <img
                src="/images/avatar-placeholder.png"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-dervora-primary"
              />
            </Link>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              className="font-heading text-lg font-semibold px-6 py-2.5 bg-dervora-primary text-dervora-cream rounded-full hover:bg-dervora-primary-dark transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Try Dervora
            </Button>
          )}
        </div>
        
      </div>
    </nav>
  );
};