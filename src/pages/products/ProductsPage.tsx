import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { getCategories, type Category } from '../../lib/api';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/ProductCardSkeleton';
import { SortDropdown, type SortOption } from '../../components/product/SortDropdown';
import { CategoryFilter } from '../../components/product/CategoryFilter';
import { FadeIn } from '../../components/ui/FadeIn';

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);

  // Debounce search agar tidak spam API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page ke 1 setiap kali search berubah
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page saat filter kategori berubah
  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);

  // Fetch categories sekali
  useEffect(() => {
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Fetch products dengan filter & pagination
  const { products, loading, error, meta } = useProducts({
    page,
    limit: 20, // Tampilkan 20 per halaman
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryId || undefined,
  });

  // Sort products di client-side (hanya untuk halaman ini)
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

  const totalPages = meta?.totalPages || 1;

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          {/* Category Filter */}
          <div className="flex-1">
            <CategoryFilter
              categories={categories}
              selectedId={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex-shrink-0">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Product Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-body text-sm text-dervora-dark/60">
            Menampilkan {sortedProducts.length} produk
            {meta?.total && ` dari total ${meta.total}`}
          </p>
        </div>

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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {sortedProducts.map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.05}>
                  <ProductCard product={product} variant="catalog" />
                </FadeIn>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="p-2 md:px-4 md:py-2 rounded-full border border-dervora-beige bg-white text-dervora-primary font-body text-sm hover:bg-dervora-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <span className="font-body text-sm text-dervora-dark/70 font-medium">
                  Halaman {page} dari {totalPages}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="p-2 md:px-4 md:py-2 rounded-full border border-dervora-beige bg-white text-dervora-primary font-body text-sm hover:bg-dervora-cream disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};