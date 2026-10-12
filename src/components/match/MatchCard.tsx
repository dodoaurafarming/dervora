import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../../lib/api';
import type { MatchResult } from '../../utils/matchScore';
import { useRoutineToggle } from '../../hooks/useRoutineToggle';
import { useRoutineStore } from '../../store/routineStore';
import { AddToRoutineModal } from '../routine/AddToRoutineModal';
import { MORNING_SLOTS, NIGHT_SLOTS } from '../../data/routineSlots';

interface MatchCardProps {
  product: Product;
  match: MatchResult;
}

export const MatchCard: React.FC<MatchCardProps> = ({ product, match }) => {
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
      // Hapus dari routine
      if (morningSlot) removeProduct(morningSlot.id, 'morning');
      if (nightSlot) removeProduct(nightSlot.id, 'night');
      toast.success(`${product.name} dihapus dari rutinitas.`);
    } else {
      // Buka modal untuk pilih waktu
      setModalOpen(true);
    }
  };

  const handleModalSuccess = () => {
    toast.success(`${product.name} ditambahkan ke rutinitas!`);
  };

  return (
    <>
      <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige shadow-sm hover:shadow-lg hover:border-dervora-primary/30 transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <Link to={`/products/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-dervora-beige/30">
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
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-heading text-5xl font-bold text-dervora-primary/30">
                {product.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Match Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-dervora-primary text-dervora-cream rounded-full font-body text-[10px] font-semibold shadow-md">
            <Sparkles size={10} />
            {match.score}% Match
          </div>

          {/* Love Icon */}
          <button
            onClick={handleLoveClick}
            aria-label={isInRoutine ? 'Hapus dari rutinitas' : 'Simpan ke rutinitas'}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-sm ${
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
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category + Brand */}
          <div className="flex items-center gap-2 mb-2">
            <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider">
              {category || 'Uncategorized'}
            </p>
            {product.brand?.name && (
              <>
                <span className="text-dervora-dark/30">•</span>
                <p className="font-body text-[10px] text-dervora-dark/60">
                  {product.brand.name}
                </p>
              </>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-body text-sm font-medium text-dervora-dark line-clamp-2 mb-2 leading-tight hover:text-dervora-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
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
                {product.reviewCount ? ` (${product.reviewCount})` : ''}
              </span>
            </div>
          )}

          {/* Reasons */}
          <div className="space-y-1.5 mb-3 flex-grow">
            {match.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <Check size={12} className="text-dervora-primary flex-shrink-0 mt-0.5" />
                <p className="font-body text-[10px] text-dervora-dark/70 leading-snug">
                  {reason}
                </p>
              </div>
            ))}
          </div>

          {/* Price */}
          <p className="font-body text-sm font-semibold text-dervora-primary mb-3">
            {product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
          </p>

          {/* Actions */}
          <Link
            to={`/products/${product.id}`}
            className="block w-full px-3 py-2 rounded-xl bg-dervora-primary/10 text-dervora-primary font-body text-xs font-medium text-center hover:bg-dervora-primary hover:text-dervora-cream transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      </div>

      {/* Add to Routine Modal */}
      <AddToRoutineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};