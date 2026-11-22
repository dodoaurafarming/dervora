import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import type { Category } from '../../lib/api';

interface CategoryFilterProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const POPULAR_CATEGORIES = ['Cleanser', 'Serum', 'Moisturizer', 'Toner', 'Sunscreen'];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedId,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { popular, others } = useMemo(() => {
    const popularList: Category[] = [];
    const othersList: Category[] = [];

    categories.forEach((cat) => {
      if (POPULAR_CATEGORIES.includes(cat.name)) {
        popularList.push(cat);
      } else {
        othersList.push(cat);
      }
    });

    popularList.sort(
      (a, b) =>
        POPULAR_CATEGORIES.indexOf(a.name) - POPULAR_CATEGORIES.indexOf(b.name)
    );
    othersList.sort((a, b) => a.name.localeCompare(b.name));

    return { popular: popularList, others: othersList };
  }, [categories]);

  const selectedCategory = categories.find((c) => c.id === selectedId);
  const isOtherSelected =
    selectedCategory && !POPULAR_CATEGORIES.includes(selectedCategory.name);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const horizontalPadding = 16;
    const width = Math.min(256, window.innerWidth - horizontalPadding * 2);
    const left = Math.max(
      horizontalPadding,
      Math.min(rect.left, window.innerWidth - width - horizontalPadding)
    );
    const top = rect.bottom + 8;
    const bottomSafeArea = window.innerWidth < 768 ? 88 : 24;
    const maxHeight = Math.max(160, Math.min(320, window.innerHeight - top - bottomSafeArea));

    setPosition({ top, left, width, maxHeight });
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const scrollContainer = scrollContainerRef.current;
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    scrollContainer?.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      scrollContainer?.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-nowrap overflow-x-auto items-center gap-2 pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 font-body text-sm transition-colors ${
          selectedId === null
            ? 'bg-dervora-primary text-dervora-cream'
            : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
        }`}
      >
        Semua
      </button>

      {popular.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 font-body text-sm transition-colors ${
            selectedId === cat.id
              ? 'bg-dervora-primary text-dervora-cream'
              : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
          }`}
        >
          {cat.name}
        </button>
      ))}

      <div className="relative flex-shrink-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
            isOtherSelected
              ? 'bg-dervora-primary text-dervora-cream'
              : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
          }`}
        >
          <span>
            {isOtherSelected ? selectedCategory.name : `Lainnya (${others.length})`}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen &&
          position &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setIsOpen(false)}
              />
              <div
                style={{
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  maxHeight: position.maxHeight,
                }}
                className="fixed overflow-y-auto bg-white border border-dervora-beige rounded-2xl shadow-xl z-[70]"
              >
                {others.map((cat) => {
                  const isActive = selectedId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
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
                        <Check size={14} className="text-dervora-primary flex-shrink-0" />
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
            </>,
            document.body
          )}
      </div>
    </div>
  );
};