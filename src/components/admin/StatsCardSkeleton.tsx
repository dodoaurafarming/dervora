import React from 'react';

export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-white rounded-2xl p-5 md:p-6 border border-dervora-beige overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 bg-dervora-beige/50 rounded animate-pulse" />
          <div className="h-8 w-16 bg-dervora-beige/50 rounded animate-pulse" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-dervora-beige/50 animate-pulse" />
      </div>
    </div>
  );
};