import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../lib/api';

interface ProductCardProps {
  product: Product;
  variant?: 'home' | 'catalog';
  showMatchScore?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'home',
  showMatchScore = false,
}) => {
  const ingredientNames = product.ingredients
    .map((i) => i.ingredient.name)
    .slice(0, 2)
    .join(' • ');

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-dervora-cream/30 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dervora-beige/50">
            <span className="font-heading italic text-dervora-dark/40 text-sm">
              No Image
            </span>
          </div>
        )}

        {/* Match Badge */}
        {(variant === 'catalog' || showMatchScore) && product.rating !== null && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-dervora-primary text-dervora-cream rounded-full font-body text-[10px] font-semibold shadow-md">
            ⭐ {product.rating.toFixed(1)}
          </div>
        )}

        {/* Save Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          aria-label="Simpan ke rutinitas"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
        >
          <Heart
            size={14}
            className="text-dervora-dark/60 hover:text-dervora-primary transition-colors"
            fill="none"
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-1">
          {product.category?.name || 'Uncategorized'}
        </p>

        <h3 className="font-body text-sm font-medium text-dervora-dark line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>

        {variant === 'catalog' && ingredientNames && (
          <p className="font-body text-[10px] text-dervora-dark/60 mb-2 line-clamp-1">
            {ingredientNames}
          </p>
        )}

        <p className="font-body text-sm font-semibold text-dervora-primary mt-auto">
          {product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
        </p>
      </div>
    </Link>
  );
};