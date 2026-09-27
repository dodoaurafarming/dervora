import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { FadeIn } from '../../components/ui/FadeIn';
import { SortDropdown, type SortOption } from '../../components/product/SortDropdown';

export const ProductsPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('best-match');

  // Kategori
  const categories = ['Semua', 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'];

  // Logic Filter & Sort
  const filteredProducts = mockProducts
    .filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'best-match') return b.matchScore - a.matchScore;
      return a.id.localeCompare(b.id); // dummy fallback untuk opsi pengurutan lain
    });

  return (
    <section className="w-full bg-dervora-cream px-6 md:px-12 lg:px-20 pt-6 md:pt-8 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
        
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
          Semua Produk
        </h1>
        
        <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-3 max-w-2xl">
          Temukan produk skincare yang sesuai dengan kebutuhan kulitmu.
        </p>

        {/* Search Bar */}
        <div className="relative mt-6 md:mt-8">
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

        {/* Filter Kategori */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`px-4 py-2 rounded-full whitespace-nowrap font-body text-sm transition-colors ${
                selectedCategory === cat 
                  ? 'bg-dervora-primary text-dervora-cream' 
                  : 'bg-white text-dervora-dark border border-dervora-beige hover:border-dervora-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Product Count + Sort */}
        <div className="flex items-center justify-between mb-6 mt-6">
          <p className="font-body text-sm text-dervora-dark/70">
            Menampilkan {filteredProducts.length} produk
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Grid Produk & Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-heading italic text-xl text-dervora-dark/60">
              Tidak ada produk yang cocok dengan pencarianmu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.05}>
                {/* Variant 'catalog' akan menampilkan Match Badge dan Ingredients */}
                <ProductCard product={product} variant="catalog" />
              </FadeIn>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
};