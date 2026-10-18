import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FlaskConical } from 'lucide-react';

const ADMIN_TABS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dervora-control-9k2x/dashboard',
  },
  // Menu Ingredients lama (path /ingredients) dihapus dari sini.
  // Menu Catalog diganti namanya menjadi 'Ingredients'
  {
    icon: FlaskConical,
    label: 'Ingredients',
    path: '/dervora-control-9k2x/catalog',
  },
];

export const AdminBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-dervora-beige z-40 shadow-dervora">
      <div className="flex justify-around items-center py-2">
        {ADMIN_TABS.map((tab, index) => {
          const Icon = tab.icon;
          let isActive = false;
          if (tab.path === '/dervora-control-9k2x/dashboard') {
            isActive = location.pathname === tab.path && index === 0;
          } else {
            isActive = location.pathname === tab.path;
          }

          return (
            <Link
              key={`${tab.path}-${index}`}
              to={tab.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? 'text-dervora-primary'
                  : 'text-dervora-dark/50 hover:text-dervora-dark'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};