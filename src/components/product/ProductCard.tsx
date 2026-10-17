import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../../lib/api';
import { useRoutineToggle } from '../../hooks/useRoutineToggle';
import { useRoutineStore } from '../../store/routineStore';
import { AddToRoutineModal } from '../routine/AddToRoutineModal';
import { MORNING_SLOTS, NIGHT_SLOTS } from '../../data/routineSlots';

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
  const { isInRoutine } = useRoutineToggle(product);
  const { removeProduct } = useRoutineStore();
  const [modalOpen, setModalOpen] = useState(false);

  const category = product.category?.name || '';
  const morningSlot = MORNING_SLOTS.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );
  const nightSlot = NIGHT_SLOTS.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );

  const handleLoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInRoutine) {
      if (morningSlot) removeProduct(morningSlot.id, 'morning');
      if (nightSlot) removeProduct(nightSlot.id, 'night');
      toast.success(`${product.name} dihapus dari rutinitas.`);
    } else {
      setModalOpen(true);
    }
  };

  // FIX: tambahkan optional chaining (?.) agar aman jika ingredients undefined
  const ingredientNames = product.ingredients
    ?.map((i) => i.ingredient.name)
    ?.slice(0, 2)
    ?.join(' • ') || '';

  return (
    <>
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
              <span className="font-heading text-3xl font-bold text-dervora-primary/30">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Match Badge */}
          {(variant === 'catalog' || showMatchScore) && product.rating !== null && (
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-dervora-primary text-dervora-cream rounded-full font-body text-[10px] font-semibold shadow-md">
              ⭐ {product.rating?.toFixed(1) || '0.0'}
            </div>
          )}

          {/* Love Icon */}
          <button
            onClick={handleLoveClick}
            aria-label={isInRoutine ? 'Hapus dari rutinitas' : 'Simpan ke rutinitas'}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-sm ${
              isInRoutine ? 'bg-red-50' : 'bg-white/90 hover:bg-white'
            }`}
          >
            <Heart
              size={14}
              className={
                isInRoutine
                  ? 'text-red-500'
                  : 'text-dervora-dark/60 hover:text-dervora-primary'
              }
              fill={isInRoutine ? 'currentColor' : 'none'}
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

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i < Math.floor(product.rating!)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-dervora-dark/20'
                    }
                  />
                ))}
              </div>
              <span className="font-body text-[10px] text-dervora-dark/60">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

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

      {/* Add to Routine Modal */}
      <AddToRoutineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        onSuccess={() => toast.success(`${product.name} ditambahkan ke rutinitas!`)}
      />
    </>
  );
};