import React, { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import { Modal } from '../admin/Modal';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import type { Product } from '../../lib/api';

interface ProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  categoryFilter?: string; // Filter produk by kategori
  slotName?: string;
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

  const { products, loading, error } = useProducts({
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
  });

  // Filter by category + bukan yang sudah deleted
  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter(
      (p) => p.category?.name.toLowerCase() === categoryFilter.toLowerCase()
    );
  }, [products, categoryFilter]);

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
      {/* Search */}
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

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-dervora-dark/50">Memuat produk...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-red-500">Gagal memuat: {error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-dervora-dark/20 mb-3" />
          <p className="font-body text-sm text-dervora-dark/60">
            Tidak ada produk {categoryFilter ? `${categoryFilter} ` : ''}yang cocok.
          </p>
        </div>
      )}

      {/* Grid Produk */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="group flex flex-col items-start gap-2 p-3 rounded-xl border border-dervora-beige hover:border-dervora-primary hover:bg-dervora-cream/30 transition-all text-left"
            >
              {/* Image */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-dervora-beige/30">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-dervora-primary/30">
                      {product.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="w-full">
                <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-0.5">
                  {product.brand?.name || 'Dervora'}
                </p>
                <p className="font-body text-xs font-medium text-dervora-dark line-clamp-2 leading-tight">
                  {product.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};