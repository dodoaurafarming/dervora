import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import type { IngredientCatalog } from '../../lib/api';

interface IngredientCardProps {
  ingredient: IngredientCatalog;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <Link
      to={`/ingredients/${ingredient.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-dervora-cream/30 overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center bg-dervora-beige/50">
            <FlaskConical size={32} className="text-dervora-primary/30" />
          </div>
        )}
        
        {/* Category Badge */}
        {ingredient.category && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-body font-semibold text-dervora-primary shadow-sm">
            {ingredient.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-heading text-lg font-bold text-dervora-dark leading-tight line-clamp-2 mb-2 group-hover:text-dervora-primary transition-colors">
          {ingredient.name}
        </h3>
        
        {ingredient.commonUses && ingredient.commonUses.length > 0 && (
          <p className="font-body text-xs text-dervora-dark/60 line-clamp-2">
            {ingredient.commonUses[0]}
          </p>
        )}
      </div>
    </Link>
  );
};