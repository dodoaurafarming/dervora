import React, { useState } from 'react';
import { Flame, Star, TrendingDown, TrendingUp, ChevronDown } from 'lucide-react';

export type SortOption = 'popular' | 'rating-high' | 'price-low' | 'price-high';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS = [
  { value: 'popular' as SortOption, label: 'Paling Populer', icon: Flame },
  { value: 'rating-high' as SortOption, label: 'Rating Tertinggi', icon: Star },
  { value: 'price-low' as SortOption, label: 'Harga Terendah', icon: TrendingDown },
  { value: 'price-high' as SortOption, label: 'Harga Tertinggi', icon: TrendingUp },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = OPTIONS.find((o) => o.value === value);
  const Icon = current?.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-dervora-beige bg-white font-body text-sm text-dervora-dark hover:border-dervora-primary/30 transition-colors whitespace-nowrap"
      >
        {Icon && <Icon size={16} className="text-dervora-primary" />}
        <span>{current?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop untuk close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-dervora-beige rounded-2xl shadow-xl overflow-hidden z-50">
            {OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-left hover:bg-dervora-cream transition-colors ${
                    isActive
                      ? 'bg-dervora-cream text-dervora-primary font-medium'
                      : 'text-dervora-dark'
                  }`}
                >
                  <OptIcon
                    size={16}
                    className={
                      isActive ? 'text-dervora-primary' : 'text-dervora-dark/60'
                    }
                  />
                  <span>{opt.label}</span>
                  {isActive && (
                    <span className="ml-auto text-dervora-primary">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};