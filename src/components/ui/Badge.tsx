
import React from 'react';

interface BadgeProps {
  label: string | number;
  type: 'match' | 'ingredient';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  type, 
  className = '' 
}) => {
  const baseStyle = 'inline-block text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap';
  
  const typeStyles = {
    match: 'bg-dervora-blush text-dervora-dark',
    ingredient: 'bg-dervora-beige text-dervora-primary',
  };

  return (
    <span className={`${baseStyle} ${typeStyles[type]} ${className}`}>
      {type === 'match' && typeof label === 'number' ? `${label}% Match` : label}
    </span>
  );
};