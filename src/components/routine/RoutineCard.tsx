import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import type { Product } from '../../lib/api';

interface RoutineCardProps {
  product: Product;
  onRemove: () => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ product, onRemove }) => {
  return (
    <div className="group relative flex items-center gap-3 p-3 bg-white rounded-2xl border border-dervora-beige hover:border-dervora-primary/30 transition-colors">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="flex-shrink-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-dervora-beige/30">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-heading text-xl font-bold text-dervora-primary/30">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <Link to={`/products/${product.id}`} className="flex-1 min-w-0">
        <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-0.5">
          {product.brand?.name || 'Dervora'}
        </p>
        <p className="font-body text-sm font-medium text-dervora-dark line-clamp-2 leading-tight">
          {product.name}
        </p>
      </Link>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-dervora-dark/40 hover:text-red-500 transition-colors"
        aria-label="Hapus dari rutinitas"
      >
        <X size={16} />
      </button>
    </div>
  );
};