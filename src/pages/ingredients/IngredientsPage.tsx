import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useIngredientCatalog } from '../../hooks/useIngredients';
import { IngredientCard } from '../../components/ingredient/IngredientCard';
import { IngredientCardSkeleton } from '../../components/ingredient/IngredientCardSkeleton';
import { FadeIn } from '../../components/ui/FadeIn';
import { Button } from '../../components/ui/Button';

const ITEMS_PER_PAGE = 24; // Jumlah yang muncul pertama kali dan saat load more

export const IngredientsPage: React.FC = () => {
  const {
    catalog,
    totalCount,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    refetch,
  } = useIngredientCatalog();

  // State untuk Load More
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Reset visibleCount ke awal setiap kali search atau filter berubah
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, categoryFilter]);

  // Potong data catalog sesuai visibleCount
  const displayedCatalog = catalog.slice(0, visibleCount);

  return (
    <section className="w-full bg-dervora-cream pt-6 md:pt-8 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12">
          <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={28} className="text-dervora-primary" />
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
              Ingredient Checker
            </h1>
          </div>
          <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-3 max-w-2xl">
            Cari tahu fungsi dan manfaat ingredients dalam produk skincare favoritmu.
          </p>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ingredient... (contoh: Niacinamide)"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-dervora-dark"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-full border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm text-dervora-dark cursor-pointer min-w-[180px]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-fr mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <IngredientCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="font-heading text-xl text-dervora-dark/70 mb-4">
              Gagal memuat ingredients: {error}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-2 rounded-full bg-dervora-primary text-dervora-cream font-body text-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && catalog.length === 0 && (
          <div className="text-center py-16">
            <p className="font-heading italic text-xl text-dervora-dark/60">
              Tidak ada ingredient yang cocok dengan pencarianmu.
            </p>
          </div>
        )}

        {!loading && !error && catalog.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-sm text-dervora-dark/60">
                Menampilkan {displayedCatalog.length} dari {catalog.length} ingredient
                {totalCount !== catalog.length && ` (dari total ${totalCount})`}
              </p>
            </div>

            {/* GRID DIUBAH MENJADI 1 KOLOM DI MOBILE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-fr mb-8">
              {displayedCatalog.map((catalogItem, index) => (
                <FadeIn key={catalogItem.id} delay={index * 0.05} className="h-full">
                  <IngredientCard ingredient={catalogItem as any} />
                </FadeIn>
              ))}
            </div>

            {/* Tombol Load More */}
            {visibleCount < catalog.length && (
              <div className="flex justify-center mt-10">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-8"
                >
                  Tampilkan Lebih Banyak
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};