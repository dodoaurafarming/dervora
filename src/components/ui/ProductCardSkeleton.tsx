import React from 'react';

interface ProductCardSkeletonProps {
  variant?: 'home' | 'catalog';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  variant = 'catalog',
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige animate-pulse">
      <div className="relative aspect-[4/3] bg-dervora-beige/40 overflow-hidden">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70" />
        {variant === 'catalog' && (
          <div className="absolute bottom-2 left-2 h-5 w-12 rounded-full bg-dervora-beige/80" />
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="h-3 w-16 rounded bg-dervora-beige/50 mb-1.5" />

        <div className="space-y-1 mb-1.5">
          <div className="h-3.5 w-full rounded bg-dervora-beige/60" />
          <div className="h-3.5 w-3/4 rounded bg-dervora-beige/60" />
        </div>

        <div className="h-3 w-20 rounded bg-dervora-beige/40 mb-1.5" />

        {variant === 'catalog' && (
          <div className="h-3 w-2/3 rounded bg-dervora-beige/40 mb-2" />
        )}

        <div className="h-5 w-24 rounded bg-dervora-beige/60 mt-auto" />
      </div>
    </div>
  );
};