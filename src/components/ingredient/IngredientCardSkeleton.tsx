import React from 'react';

export const IngredientCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-dervora-beige/50" />

      {/* Content Skeleton */}
      <div className="p-4 flex-grow flex flex-col gap-2">
        <div className="h-4 bg-dervora-beige/50 rounded w-3/4" />
        <div className="h-3 bg-dervora-beige/50 rounded w-full" />
        <div className="h-3 bg-dervora-beige/50 rounded w-2/3" />
      </div>
    </div>
  );
};