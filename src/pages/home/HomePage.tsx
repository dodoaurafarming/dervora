import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FeaturesSection } from '../../components/home/FeaturesSection';
import { mockProducts } from '../../data/mockProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { FadeIn } from '../../components/ui/FadeIn';

export const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[50vh] min-h-[500px] overflow-hidden">
        {/* Background Image (Fokus ke Kanan di Mobile) */}
        <img 
          src="/images/hero.jpg" 
          alt="Dervora — Your skin, your little self-care journey" 
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center" 
        />
        
        {/* Overlay Desktop (Tipis) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-dervora-cream/85 via-dervora-cream/30 to-transparent" />
        
        {/* Overlay Mobile (Lebih Tebal) */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-r from-dervora-cream/95 via-dervora-cream/70 to-transparent" />
        
        {/* Content Overlay (Teks & Tombol) */}
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 md:px-12 lg:px-20 max-w-md md:max-w-xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
              Your skin, your little self-care journey ♡
            </h1>
            
            <p className="font-body text-base md:text-lg text-dervora-dark/80 mt-4 md:mt-6">
              Temukan skincare yang sesuai dengan kebutuhan kulitmu, mulai dari mengenali tipe kulit hingga menemukan produk yang cocok.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
              <Button variant="primary" size="lg" className="whitespace-nowrap px-6">
                ✦ Start Skin Quiz
              </Button>
              <Button variant="outline" size="lg" className="whitespace-nowrap px-6">
                Explore Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products Section */}
      <section className="w-full bg-dervora-cream pt-4 md:pt-6 pb-8 md:pb-12 px-6 md:px-12 lg:px-20">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8 md:mb-12 max-w-6xl mx-auto">
          <FadeIn>
            <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary">
              Popular Picks ♡
            </h2>
            <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-2 max-w-xl">
              Produk pilihan yang sedang banyak dicari.
            </p>
          </FadeIn>
          
          {/* "See All" Link (Desktop Only) */}
          <Link 
            to="/products" 
            className="hidden md:block text-dervora-primary font-body text-sm font-medium underline underline-offset-4 decoration-dervora-primary/40 hover:decoration-dervora-primary transition-colors"
          >
            Lihat Semua
          </Link>
        </div>
        
        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto">
          {mockProducts.slice(0, 4).map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.1}>
              <ProductCard 
                product={product} 
                showMatchScore={false} 
              />
            </FadeIn>
          ))}
        </div>

        {/* "See All" Link (Mobile Only) */}
        <Link 
          to="/products" 
          className="md:hidden block mt-6 text-center text-dervora-primary font-body text-sm font-medium underline underline-offset-4 decoration-dervora-primary/40"
        >
          Lihat Semua Produk
        </Link>
      </section>

      {/* CTA Section */}
      <section className="relative w-full min-h-[380px] md:min-h-[450px] overflow-hidden flex items-center justify-center">
        {/* Background Image (Lokal) */}
        <img 
          src="/images/cta-bg.jpg" 
          alt="Dervora skincare products"
          className="absolute inset-0 w-full h-full object-cover object-center bg-dervora-beige"
        />
        
        {/* Overlay Linear Vertikal (Bawah → Atas) */}
        <div className="absolute inset-0 bg-gradient-to-t from-dervora-cream/95 via-dervora-cream/60 to-transparent" />
        
        {/* Content Overlay */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 w-full">
          <FadeIn className="max-w-2xl text-center mx-auto">
            {/* Aksen Line */}
            <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-6 mx-auto" />
            
            {/* Judul */}
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-dervora-primary leading-tight drop-shadow-md">
              Not sure where to start with your skincare?
            </h2>
            
            {/* Subtext */}
            <p className="font-heading italic font-medium text-base md:text-lg text-dervora-dark mt-5 md:mt-6 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Every skin is unique. And so are its needs. Take our quick skin quiz to discover your skin type, identify your concerns, and let Dervora guide you toward products that truly match your skin's journey.
            </p>
            
            {/* Tombol */}
            <div className="mt-8 md:mt-10">
              <Button variant="primary" size="lg" className="whitespace-nowrap px-8">
                Take the Quiz
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
};