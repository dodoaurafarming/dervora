import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FeaturesSection } from '../../components/home/FeaturesSection';
import { ProductCard } from '../../components/product/ProductCard';
import { FadeIn } from '../../components/ui/FadeIn';
import { getImageUrl } from '../../utils/imageUrl';
import { useProducts } from '../../hooks/useProducts';
import { ProductCardSkeleton } from '../../components/ui/ProductCardSkeleton';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, loading } = useProducts({ page: 1, limit: 4 });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  const handleQuizClick = () => {
    if (user) {
      navigate('/quiz');
    } else {
      setShowLoginWarning(true);
    }
  };

  return (
    <>
      <section className="relative w-full h-[70vh] md:h-[50vh] min-h-[500px] overflow-hidden">
        <img
          src={getImageUrl('images/hero.jpg')}
          alt="Dervora — Your skin, your little self-care journey"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
        />

        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-dervora-cream/85 via-dervora-cream/30 to-transparent" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-r from-dervora-cream/95 via-dervora-cream/70 to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 md:px-12 lg:px-20 max-w-md md:max-w-xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
              Your skin, your little self-care journey ♡
            </h1>

            <p className="font-body text-base md:text-lg text-dervora-dark/80 mt-4 md:mt-6">
              Temukan skincare yang sesuai dengan kebutuhan kulitmu, mulai dari mengenali tipe kulit hingga menemukan produk yang cocok.
            </p>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
              <div>
                <Button
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap px-6"
                  onClick={handleQuizClick}
                >
                  ✦ Start Skin Quiz
                </Button>
              </div>

              <Link to="/products">
                <Button variant="outline" size="lg" className="whitespace-nowrap px-6">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />

      <section className="w-full bg-dervora-cream pt-4 md:pt-6 pb-8 md:pb-12 px-6 md:px-12 lg:px-20">
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

          <Link
            to="/products"
            className="hidden md:block text-dervora-primary font-body text-sm font-medium underline underline-offset-4 decoration-dervora-primary/40 hover:decoration-dervora-primary transition-colors"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          {!loading &&
            products.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.1}>
                <ProductCard product={product} showMatchScore={false} />
              </FadeIn>
            ))}
        </div>

        <Link
          to="/products"
          className="md:hidden block mt-6 text-center text-dervora-primary font-body text-sm font-medium underline underline-offset-4 decoration-dervora-primary/40"
        >
          Lihat Semua Produk
        </Link>
      </section>

      <section className="relative w-full min-h-[380px] md:min-h-[450px] overflow-hidden flex items-center justify-center">
        <img
          src={getImageUrl('images/cta-bg.jpg')}
          alt="Dervora skincare products"
          className="absolute inset-0 w-full h-full object-cover object-center bg-dervora-beige"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-dervora-cream/95 via-dervora-cream/60 to-transparent" />

        <div className="relative z-10 px-6 md:px-12 lg:px-20 w-full">
          <FadeIn className="max-w-2xl text-center mx-auto">
            <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-6 mx-auto" />

            <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-dervora-primary leading-tight drop-shadow-md">
              Not sure where to start with your skincare?
            </h2>

            <p className="font-heading italic font-medium text-base md:text-lg text-dervora-dark mt-5 md:mt-6 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Every skin is unique. And so are its needs. Take our quick skin quiz to discover your skin type, identify your concerns, and let Dervora guide you toward products that truly match your skin's journey.
            </p>

            <div className="mt-8 md:mt-10">
              <button
                onClick={handleQuizClick}
                className="whitespace-nowrap px-8 py-3 bg-dervora-primary text-dervora-cream rounded-full font-heading text-lg font-semibold shadow-md hover:bg-dervora-primary-dark hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Take the Quiz
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {showLoginWarning && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setShowLoginWarning(false)}
            className="absolute inset-0 bg-dervora-dark/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-dervora-cream rounded-3xl shadow-2xl border border-dervora-beige p-8 md:p-10">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-dervora-primary/10 flex items-center justify-center border border-dervora-primary/20">
                <LogIn size={30} className="text-dervora-primary" />
              </div>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary text-center mb-2">
              Yuk, Login Dulu ♡
            </h2>

            <p className="font-body text-dervora-dark/70 text-center text-sm md:text-base leading-relaxed mb-2">
              Skin Quiz akan menyimpan hasil analisis kulitmu secara permanen di akun Dervora.
            </p>
            <p className="font-body text-dervora-dark/50 text-center text-xs md:text-sm leading-relaxed mb-8">
              Dengan begitu, rekomendasi produk dan rutinitas skincare-mu bisa terus berkembang seiring waktu.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLoginWarning(false)}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-dervora-dark bg-white border border-dervora-beige hover:border-dervora-primary hover:text-dervora-primary transition-all duration-300"
              >
                Nanti Saja
              </button>
              <button
                onClick={() => {
                  setShowLoginWarning(false);
                  navigate('/profile');
                }}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-white bg-dervora-primary hover:bg-dervora-primary-dark shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Masuk Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};