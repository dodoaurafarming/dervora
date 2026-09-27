import React from 'react';
import { Home, ShoppingBag, FlaskConical, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Products', icon: ShoppingBag, path: '/products' },
    { label: 'Ingredients', icon: FlaskConical, path: '/ingredients' },
    { label: 'My Routine', icon: Calendar, path: '/my-routine' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-dervora-cream border-t border-dervora-beige z-50">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-dervora-primary' : 'text-dervora-dark/50'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};