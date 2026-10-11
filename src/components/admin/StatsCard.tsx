import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon }) => {
  return (
    <div className="relative bg-white rounded-2xl p-5 md:p-6 border border-dervora-beige overflow-hidden hover:shadow-lg hover:border-dervora-primary/30 transition-all duration-300 group">
      {/* Accent Line Kiri */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-dervora-primary to-dervora-primary/20" />

      <div className="flex items-start justify-between">
        {/* Left: Label + Value */}
        <div className="flex-1 pl-3">
          <p className="font-body text-xs md:text-sm text-dervora-dark/60 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary">
            {value}
          </p>
        </div>

        {/* Right: Icon */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-dervora-primary/10 flex items-center justify-center group-hover:bg-dervora-primary/20 transition-colors">
          <Icon
            size={24}
            className="text-dervora-primary"
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
};