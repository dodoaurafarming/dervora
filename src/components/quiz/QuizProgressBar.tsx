import React from 'react';

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-body text-xs md:text-sm text-dervora-dark/60">
          Pertanyaan {current} dari {total}
        </span>
        <span className="font-body text-xs md:text-sm font-semibold text-dervora-primary">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-2 bg-dervora-beige/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-dervora-primary to-dervora-primary/70 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};