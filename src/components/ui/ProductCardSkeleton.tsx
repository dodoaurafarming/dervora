import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige animate-pulse">
      <div className="aspect-[4/5] bg-dervora-beige/50" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-dervora-beige/50 rounded w-1/3" />
        <div className="h-4 bg-dervora-beige/50 rounded w-3/4" />
        <div className="h-3 bg-dervora-beige/50 rounded w-1/2" />
        <div className="h-4 bg-dervora-beige/50 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
};