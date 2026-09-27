import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getImageUrl } from '../../utils/imageUrl';
import type { Product } from '../../data/types';

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
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-dervora-cream/30 overflow-hidden">
        <img
          src={getImageUrl(`images/products/${product.id}.jpg`)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            // Fallback jika gambar tidak ditemukan
            (e.target as HTMLImageElement).src = getImageUrl('images/products/serum.jpg');
          }}
        />

        {/* Match Badge — untuk variant catalog atau showMatchScore */}
        {(variant === 'catalog' || showMatchScore) && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-dervora-primary text-dervora-cream rounded-full font-body text-[10px] font-semibold shadow-md">
            {product.matchScore}% Match
          </div>
        )}

        {/* Save Icon — Kanan Atas */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // TODO: Toggle save to routine
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
          {product.category}
        </p>

        <h3 className="font-body text-sm font-medium text-dervora-dark line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>

        {/* Ingredients — untuk variant catalog */}
        {variant === 'catalog' && (
          <p className="font-body text-[10px] text-dervora-dark/60 mb-2 line-clamp-1">
            {product.ingredients.slice(0, 2).join(' • ')}
          </p>
        )}

        <p className="font-body text-sm font-semibold text-dervora-primary mt-auto">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  );
};