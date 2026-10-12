import React from 'react';
import { Link } from 'react-router-dom';
import type { Ingredient } from '../../lib/api';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <Link
      to={`/ingredients/${ingredient.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige shadow-sm hover:shadow-lg hover:border-dervora-primary/30 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image / Icon Container — ASPECT RATIO FIX */}
      <div className="relative aspect-[4/3] overflow-hidden bg-dervora-beige/30 flex items-center justify-center">
        {ingredient.photoUrl ? (
          <img
            src={ingredient.photoUrl}
            alt={ingredient.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          // OPSI C: Initial huruf pertama
          <span className="font-heading text-7xl font-bold text-dervora-primary/30 group-hover:text-dervora-primary/50 transition-colors select-none">
            {ingredient.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content — FLEX GROW biar card sama tinggi */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-heading text-base md:text-lg font-bold text-dervora-primary line-clamp-2 mb-2 leading-tight">
          {ingredient.name}
        </h3>

        {ingredient.function && (
          <p className="font-body text-xs md:text-sm text-dervora-dark/70 line-clamp-2 leading-relaxed">
            {ingredient.function}
          </p>
        )}
      </div>
    </Link>
  );
};