import React, { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Category } from '../../lib/api';

interface CategoryFilterProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
}

/**
 * Top 5 kategori populer yang selalu tampil sebagai pills.
 * Urutan sesuai array ini.
 */
const POPULAR_CATEGORIES = ['Cleanser', 'Serum', 'Moisturizer', 'Toner', 'Sunscreen'];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedId,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { popular, others } = useMemo(() => {
    const popular: Category[] = [];
    const others: Category[] = [];

    categories.forEach((cat) => {
      if (POPULAR_CATEGORIES.includes(cat.name)) {
        popular.push(cat);
      } else {
        others.push(cat);
      }
    });

    popular.sort(
      (a, b) =>
        POPULAR_CATEGORIES.indexOf(a.name) - POPULAR_CATEGORIES.indexOf(b.name)
    );
    others.sort((a, b) => a.name.localeCompare(b.name));

    return { popular, others };
  }, [categories]);

  const selectedCategory = categories.find((c) => c.id === selectedId);
  const isOtherSelected =
    selectedCategory && !POPULAR_CATEGORIES.includes(selectedCategory.name);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* "Semua" */}
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
          selectedId === null
            ? 'bg-dervora-primary text-dervora-cream'
            : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
        }`}
      >
        Semua
      </button>

      {/* Top 5 Popular Pills */}
      {popular.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
            selectedId === cat.id
              ? 'bg-dervora-primary text-dervora-cream'
              : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}

      {/* Dropdown "Kategori Lainnya" */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
            isOtherSelected
              ? 'bg-dervora-primary text-dervora-cream'
              : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
          }`}
        >
          <span>
            {isOtherSelected ? selectedCategory!.name : `Lainnya (${others.length})`}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-dervora-beige rounded-2xl shadow-xl z-50">
              {others.map((cat) => {
                const isActive = selectedId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onChange(cat.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 font-body text-sm text-left hover:bg-dervora-cream transition-colors ${
                      isActive
                        ? 'bg-dervora-cream text-dervora-primary font-medium'
                        : 'text-dervora-dark'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isActive && (
                      <Check size={14} className="text-dervora-primary" />
                    )}
                  </button>
                );
              })}
              {others.length === 0 && (
                <div className="px-4 py-3 font-body text-sm text-dervora-dark/50 text-center">
                  Tidak ada kategori lain
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};