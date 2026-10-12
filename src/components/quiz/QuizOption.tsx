import React from 'react';
import { Check } from 'lucide-react';

interface QuizOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const QuizOption: React.FC<QuizOptionProps> = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
        selected
          ? 'border-dervora-primary bg-dervora-primary/5 shadow-sm'
          : 'border-dervora-beige bg-white hover:border-dervora-primary/40 hover:bg-dervora-cream/30'
      }`}
    >
      {/* Checkbox / Radio Indicator */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected
            ? 'border-dervora-primary bg-dervora-primary'
            : 'border-dervora-dark/30 bg-white'
        }`}
      >
        {selected && <Check size={14} className="text-dervora-cream" strokeWidth={3} />}
      </div>

      {/* Label */}
      <span
        className={`font-body text-sm md:text-base ${
          selected ? 'text-dervora-primary font-medium' : 'text-dervora-dark'
        }`}
      >
        {label}
      </span>
    </button>
  );
};