import React from 'react';

export const IngredientTableSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-dervora-beige overflow-hidden animate-pulse">
      <div className="bg-dervora-cream/50 px-6 py-4 border-b border-dervora-beige">
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-dervora-beige/50 rounded" />
          <div className="h-4 w-32 bg-dervora-beige/50 rounded" />
          <div className="h-4 w-40 bg-dervora-beige/50 rounded" />
        </div>
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 border-b border-dervora-beige/50 last:border-0"
        >
          <div className="flex items-center gap-4">
            <div className="h-4 w-8 bg-dervora-beige/50 rounded" />
            <div className="h-10 w-10 bg-dervora-beige/50 rounded-lg" />
            <div className="h-4 flex-1 bg-dervora-beige/50 rounded" />
            <div className="h-8 w-8 bg-dervora-beige/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};