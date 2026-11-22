import React from 'react';
import { Flame, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { CustomDropdown, type DropdownOption } from '../ui/CustomDropdown';

export type SortOption = 'popular' | 'rating-high' | 'price-low' | 'price-high';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: DropdownOption<SortOption>[] = [
  { value: 'popular', label: 'Paling Populer', icon: Flame },
  { value: 'rating-high', label: 'Rating Tertinggi', icon: Star },
  { value: 'price-low', label: 'Harga Terendah', icon: TrendingDown },
  { value: 'price-high', label: 'Harga Tertinggi', icon: TrendingUp },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <CustomDropdown
      value={value}
      options={OPTIONS}
      onChange={onChange}
      align="right"
    />
  );
};