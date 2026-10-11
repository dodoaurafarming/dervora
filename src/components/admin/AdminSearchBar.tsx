import React from 'react';
import { Search, X } from 'lucide-react';

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari produk...',
}) => {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm text-dervora-dark"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-dervora-cream transition-colors"
          aria-label="Hapus pencarian"
        >
          <X size={16} className="text-dervora-dark/60" />
        </button>
      )}
    </div>
  );
};