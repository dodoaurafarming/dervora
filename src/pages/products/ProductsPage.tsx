import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { getCategories, type Category } from '../../lib/api';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/ProductCardSkeleton';
import { SortDropdown, type SortOption } from '../../components/product/SortDropdown';
import { FadeIn } from '../../components/ui/FadeIn';

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Fetch categories sekali
  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Fetch products dengan filter
  const { products, loading, error } = useProducts({
    page: 1,
    limit: 50,
    search: searchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
  });

  // Sort products di client-side
  const sortedProducts = useMemo(() => {
    if (!products.length) return products;

    const sorted = [...products].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'rating-high') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'price-low') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-high') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });

    return sorted;
  }, [products, sortBy]);

  return (
    <section className="w-full bg-dervora-cream pt-6 md:pt-8 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
            Semua Produk
          </h1>
          <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-3 max-w-2xl">
            Temukan produk skincare yang sesuai dengan kebutuhan kulitmu.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mt-6 md:mt-8 mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-dervora-dark"
          />
        </div>

        {/* Filter + Sort Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          {/* Category Filter — scroll horizontal tanpa scrollbar di mobile, wrap di desktop */}
          <div className="flex md:flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible flex-1">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors flex-shrink-0 ${
                selectedCategoryId === null
                  ? 'bg-dervora-primary text-dervora-cream'
                  : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors flex-shrink-0 ${
                  selectedCategoryId === cat.id
                    ? 'bg-dervora-primary text-dervora-cream'
                    : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex-shrink-0">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Product Count */}
        <p className="font-body text-sm text-dervora-dark/60 mb-4">
          Menampilkan {sortedProducts.length} produk
        </p>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="font-heading text-xl text-dervora-dark/70 mb-4">
              Gagal memuat produk: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full bg-dervora-primary text-dervora-cream font-body text-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="font-heading italic text-xl text-dervora-dark/60">
              Tidak ada produk yang cocok dengan pencarianmu.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {sortedProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.05}>
                <ProductCard product={product} variant="catalog" />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};