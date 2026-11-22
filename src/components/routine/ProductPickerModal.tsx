import React, { useState, useMemo } from 'react';
import { Search, Package, Sparkles, Check, Star } from 'lucide-react';
import { Modal } from '../admin/Modal';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuizStore } from '../../store/quizStore';
import { calculateSkinProfile } from '../../utils/quizScoring';
import { calculateMatchScore, type MatchResult } from '../../utils/matchScore';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../lib/api';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  categoryFilter?: string;
  slotName?: string;
}

interface EnrichedProduct {
  product: Product;
  match: MatchResult | null;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  categoryFilter,
  slotName,
}) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { user } = useAuth();
  const { answers, completed } = useQuizStore();

  const profile = useMemo(() => {
    if (!user || !completed) return null;
    return calculateSkinProfile(answers);
  }, [user, completed, answers]);

  const { products, loading, error } = useProducts({
    page: 1,
    limit: 500,
    search: debouncedSearch || undefined,
  });

  const enrichedProducts = useMemo<EnrichedProduct[]>(() => {
    let result = products;

    if (categoryFilter) {
      result = result.filter(
        (p) => p.category?.name.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    const withMatch: EnrichedProduct[] = result.map((product) => ({
      product,
      match: profile ? calculateMatchScore(product, profile) : null,
    }));

    if (profile) {
      withMatch.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
    }

    return withMatch;
  }, [products, categoryFilter, profile]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pilih ${slotName || 'Produk'}`}
      size="lg"
    >
      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-dervora-dark/50 animate-pulse">
            Memuat {enrichedProducts.length > 0 ? enrichedProducts.length : 'semua'} produk...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-red-500">Gagal memuat: {error}</p>
        </div>
      )}

      {!loading && !error && enrichedProducts.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-dervora-dark/20 mb-3" />
          <p className="font-body text-sm text-dervora-dark/60">
            Tidak ada produk {categoryFilter ? `${categoryFilter} ` : ''}yang ditemukan.
          </p>
        </div>
      )}

      {!loading && !error && enrichedProducts.length > 0 && (
        <>
          <p className="font-body text-xs text-dervora-dark/50 mb-3">
            Menampilkan <span className="font-semibold text-dervora-dark">{enrichedProducts.length}</span> produk
            {profile ? ' • diurutkan berdasarkan kecocokan dengan kulitmu ♡' : ''}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-1 pb-1">
            {enrichedProducts.map(({ product, match }) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dervora-beige shadow-sm hover:shadow-md hover:border-dervora-primary/40 transition-all duration-300 text-left"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-dervora-beige/30">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-3xl font-bold text-dervora-primary/30">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {match && (
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 bg-dervora-primary text-dervora-cream rounded-full font-body text-[10px] font-semibold shadow-md">
                      <Sparkles size={10} />
                      {match.score}% Match
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col flex-grow w-full">
                  <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-1">
                    {product.brand?.name || 'Dervora'}
                  </p>

                  <h3 className="font-body text-xs sm:text-sm font-medium text-dervora-dark line-clamp-2 leading-tight mb-1.5 group-hover:text-dervora-primary transition-colors">
                    {product.name}
                  </h3>

                  {product.rating != null && product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
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

                  {match && match.reasons.length > 0 && (
                    <div className="space-y-1 mb-2 flex-grow">
                      {match.reasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <Check size={11} className="text-dervora-primary flex-shrink-0 mt-0.5" />
                          <p className="font-body text-[10px] text-dervora-dark/70 leading-snug line-clamp-1">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="font-body text-xs font-semibold text-dervora-primary mt-auto pt-1">
                    {product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};