import React, { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useIngredients } from '../../hooks/useIngredients';
import { IngredientCard } from '../../components/ingredient/IngredientCard';
import { IngredientCardSkeleton } from '../../components/ingredient/IngredientCardSkeleton';
import { FadeIn } from '../../components/ui/FadeIn';
import { useDebounce } from '../../hooks/useDebounce';

export const IngredientsPage: React.FC = () => {
  const { ingredients, loading, error, refetch } = useIngredients();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filteredIngredients = useMemo(() => {
    if (!debouncedSearch) return ingredients;
    const q = debouncedSearch.toLowerCase();
    return ingredients.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.function && i.function.toLowerCase().includes(q))
    );
  }, [ingredients, debouncedSearch]);

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

        <div className="relative mb-8">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dervora-dark/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ingredient... (contoh: Niacinamide)"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-dervora-dark"
          />
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
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

        {!loading && !error && filteredIngredients.length === 0 && (
          <div className="text-center py-16">
            <p className="font-heading italic text-xl text-dervora-dark/60">
              Tidak ada ingredient yang cocok dengan pencarianmu.
            </p>
          </div>
        )}

        {!loading && !error && filteredIngredients.length > 0 && (
          <>
            <p className="font-body text-sm text-dervora-dark/60 mb-6">
              Menampilkan {filteredIngredients.length} ingredient
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 auto-rows-fr">
            {filteredIngredients.map((ing, index) => (
                <FadeIn key={ing.id} delay={index * 0.05} className="h-full">
                <IngredientCard ingredient={ing} />
                </FadeIn>
            ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};