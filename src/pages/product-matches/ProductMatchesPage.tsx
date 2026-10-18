import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertCircle, Filter, Search } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { useProducts } from '../../hooks/useProducts';
import { calculateSkinProfile } from '../../utils/quizScoring';
import { calculateMatchScore } from '../../utils/matchScore';
import { MatchCard } from '../../components/match/MatchCard';
import { ProductCardSkeleton } from '../../components/ui/ProductCardSkeleton';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';
import { useDebounce } from '../../hooks/useDebounce';

const CATEGORIES = ['Semua', 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'];

type SortOption = 'match' | 'price-low' | 'price-high' | 'rating';

export const ProductMatchesPage: React.FC = () => {
  const { answers, completed } = useQuizStore();
  // Naikkan limit fetch dari API agar semua produk terambil (maksimal 500 di backend)
  const { products, loading, error } = useProducts({ page: 1, limit: 500 });

  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // State untuk "Load More"
  const [visibleCount, setVisibleCount] = useState(24);

  // Hitung skin profile dari answers
  const profile = useMemo(() => calculateSkinProfile(answers), [answers]);

  // Hitung match score untuk setiap produk
  const matchedProducts = useMemo(() => {
    if (!products.length) return [];

    const withScore = products.map((product) => ({
      product,
      match: calculateMatchScore(product, profile),
    }));

    // Filter by category
    let filtered = withScore;
    if (categoryFilter !== 'Semua') {
      filtered = filtered.filter(
        (item) => item.product.category?.name === categoryFilter
      );
    }

    // Filter by search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.product.name.toLowerCase().includes(q) ||
          (item.product.brand?.name.toLowerCase().includes(q) ?? false)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'match') return b.match.score - a.match.score;
      if (sortBy === 'price-low') return (a.product.price || 0) - (b.product.price || 0);
      if (sortBy === 'price-high') return (b.product.price || 0) - (a.product.price || 0);
      if (sortBy === 'rating') return (b.product.rating || 0) - (a.product.rating || 0);
      return 0;
    });

    return filtered; // KEMBALIKAN SEMUA HASIL (TANPA SLICE)
  }, [products, profile, categoryFilter, sortBy, debouncedSearch]);

  // Ambil produk yang akan ditampilkan berdasarkan visibleCount
  const displayedProducts = matchedProducts.slice(0, visibleCount);

  // Reset visibleCount jika filter berubah
  React.useEffect(() => {
    setVisibleCount(24);
  }, [categoryFilter, sortBy, debouncedSearch]);

  // Kalau belum quiz, redirect ke quiz
  if (!completed) {
    return (
      <section className="w-full min-h-screen bg-dervora-cream flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <AlertCircle size={56} className="text-dervora-primary/40 mx-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-4">
            Belum ada profil kulit
          </h1>
          <p className="font-body text-base text-dervora-dark/70 mb-8">
            Selesaikan quiz terlebih dahulu untuk melihat rekomendasi produk yang cocok dengan kulitmu.
          </p>
          <Link to="/quiz">
            <Button variant="primary" size="lg">
              Mulai Quiz
              <Sparkles size={16} className="inline ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-dervora-cream pt-6 md:pt-8 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <header className="mb-8 md:mb-10">
            <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
              Rekomendasi Produk ♡
            </h1>
            <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-3 max-w-2xl">
              Produk yang paling cocok dengan profil kulitmu.
            </p>

            {/* Profile Summary */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="font-body text-sm text-dervora-dark/60">Berdasarkan profil:</span>
              <span className="px-3 py-1 bg-dervora-primary/10 text-dervora-primary rounded-full font-body text-xs font-medium">
                {profile.skinType}
              </span>
              {profile.isAcneProne && (
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-body text-xs font-medium">
                  Acne-Prone
                </span>
              )}
              {profile.isSensitive && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-body text-xs font-medium">
                  Sensitive
                </span>
              )}
              {profile.isDehydrated && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-body text-xs font-medium">
                  Dehydrated
                </span>
              )}
              <Link
                to="/skin-profile"
                className="font-body text-xs text-dervora-primary underline hover:no-underline ml-2"
              >
                Lihat Profil
              </Link>
            </div>
          </header>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl border border-dervora-beige p-4 md:p-5 mb-6">
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

            {/* Category + Sort */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
                      categoryFilter === cat
                        ? 'bg-dervora-primary text-dervora-cream'
                        : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-dervora-dark/50" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-xl border border-dervora-beige bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-dervora-primary/50"
                >
                  <option value="match">Match Tertinggi</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="font-body text-red-700 mb-3">Gagal memuat produk: {error}</p>
            <Button variant="primary" size="md" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && matchedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="font-heading italic text-xl text-dervora-dark/60">
              Tidak ada produk yang cocok dengan filter ini.
            </p>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && matchedProducts.length > 0 && (
          <>
            <p className="font-body text-sm text-dervora-dark/60 mb-6">
              Menampilkan {displayedProducts.length} dari total {matchedProducts.length} rekomendasi produk
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {displayedProducts.map((item, index) => (
                <FadeIn key={item.product.id} delay={index * 0.05}>
                  <MatchCard product={item.product} match={item.match} />
                </FadeIn>
              ))}
            </div>

            {/* Tombol Load More */}
            {visibleCount < matchedProducts.length && (
              <div className="flex justify-center mt-10">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setVisibleCount(prev => prev + 24)}
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