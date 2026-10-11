import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-dervora-beige bg-white">
      <p className="font-body text-sm text-dervora-dark/60 hidden sm:block">
        Halaman <span className="font-semibold text-dervora-primary">{page}</span> dari{' '}
        <span className="font-semibold text-dervora-primary">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg hover:bg-dervora-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={18} className="text-dervora-dark" />
        </button>

        {/* Page Numbers */}
        {getPages().map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className="px-2 font-body text-sm text-dervora-dark/40"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[36px] h-9 px-3 rounded-lg font-body text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-dervora-primary text-dervora-cream'
                  : 'text-dervora-dark hover:bg-dervora-cream'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg hover:bg-dervora-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={18} className="text-dervora-dark" />
        </button>
      </div>
    </div>
  );
};