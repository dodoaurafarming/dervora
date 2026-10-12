import React from 'react';
import { Plus } from 'lucide-react';

interface EmptySlotProps {
  slotName: string;
  category: string;
  required?: boolean;
  onClick: () => void;
}

export const EmptySlot: React.FC<EmptySlotProps> = ({
  slotName,
  category,
  required = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed border-dervora-beige hover:border-dervora-primary hover:bg-dervora-cream/30 transition-all text-left"
    >
      {/* Plus Icon */}
      <div className="w-14 h-14 rounded-xl bg-dervora-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-dervora-primary/20 transition-colors">
        <Plus size={22} className="text-dervora-primary" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-dervora-dark">
          {slotName}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className="font-body text-xs text-dervora-dark/50">
          Tambah produk {category}
        </p>
      </div>
    </button>
  );
};