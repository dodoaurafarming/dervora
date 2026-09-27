import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Product } from '../../data/types';

interface ProductCardProps {
  product: Product;
  showMatchScore?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showMatchScore = false }) => {
  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group block relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-dervora-cream to-dervora-beige/50" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-dervora-primary/5 group-hover:ring-dervora-primary/20 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-dervora-primary/10 transition-all duration-500" />
      
      <div className="relative">
        <div className="relative aspect-[5/6] overflow-hidden bg-dervora-beige/30">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-dervora-dark/5 to-transparent" />
          
          {showMatchScore && product.matchScore && (
            <div className="absolute top-2 left-2">
              <Badge label={`${product.matchScore}%`} type="match" />
            </div>
          )}
          
          <button 
            onClick={(e) => e.preventDefault()} 
            aria-label="Simpan ke rutinitas" 
            className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
          >
            <Heart size={14} className="text-dervora-dark/60 group-hover:text-dervora-primary transition-colors" fill="none" />
          </button>
        </div>
        
        <div className="p-2.5 md:p-3">
          <p className="font-body text-[9px] md:text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-body text-xs md:text-sm font-medium text-dervora-dark line-clamp-2 mb-1 leading-tight">
            {product.name}
          </h3>
          <p className="font-body text-[10px] md:text-xs text-dervora-dark/60 mb-2">
            {product.brand}
          </p>
          <p className="font-body text-xs md:text-sm font-semibold text-dervora-primary">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </Link>
  );
};