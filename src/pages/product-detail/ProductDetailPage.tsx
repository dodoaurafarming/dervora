import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ArrowLeft } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { Button } from '../../components/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id ? parseInt(id, 10) : null);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-dervora-cream flex items-center justify-center">
        <p className="font-heading italic text-xl text-dervora-dark/60">Memuat...</p>
      </div>
    );
  }

  // Error / Not Found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-dervora-cream flex flex-col items-center justify-center px-6 py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-4">
          Produk tidak ditemukan
        </h1>
        <p className="font-body text-base text-dervora-dark/70 mb-8">
          {error || 'Produk yang kamu cari tidak tersedia.'}
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Kembali ke Products
          </Button>
        </Link>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < Math.floor(rating)
            ? 'text-dervora-primary fill-dervora-primary'
            : 'text-dervora-dark/30'
        }
      />
    ));
  };

  return (
    <div className="min-h-screen bg-dervora-cream px-6 md:px-12 lg:px-20 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-body text-sm text-dervora-dark/70 hover:text-dervora-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Products
        </Link>

        {/* Grid 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Kolom Kiri: Gambar */}
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dervora-beige/30">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading italic text-dervora-dark/40">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Info */}
          <div>
            <span className="inline-block px-3 py-1 bg-dervora-blush text-dervora-dark rounded-full font-body text-xs uppercase tracking-wider">
              {product.category?.name || 'Uncategorized'}
            </span>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary mt-4 leading-tight">
              {product.name}
            </h1>

            <p className="font-body text-base text-dervora-dark/70 mt-2">
              {product.brand.name}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {product.rating ? renderStars(product.rating) : renderStars(0)}
              </div>
              <span className="font-body text-sm text-dervora-dark/60">
                {product.rating ? product.rating.toFixed(1) : '-'} (
                {product.reviewCount || 0} ulasan)
              </span>
            </div>

            <p className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mt-4">
              {product.price
                ? `Rp ${product.price.toLocaleString('id-ID')}`
                : 'Hubungi Kami'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="primary" size="lg" className="whitespace-nowrap">
                <Heart size={18} className="inline mr-2" />
                Tambah ke Rutinitas
              </Button>
              <Button variant="outline" size="lg" className="whitespace-nowrap">
                Beli Sekarang
              </Button>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Deskripsi
          </h2>
          <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
            {product.description || 'Belum tersedia.'}
          </p>
        </section>

        {/* Key Ingredients */}
        {product.ingredients.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Key Ingredients
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-dervora-beige text-dervora-dark rounded-full font-body text-sm"
                >
                  {ing.ingredient.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Suitable For */}
        {product.skinTypes && product.skinTypes.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Cocok Untuk
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.skinTypes.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-dervora-blush/50 text-dervora-dark rounded-full font-body text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Cara Pakai */}
        <section className="mt-8">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Cara Pakai
          </h2>
          <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
            {product.howToUse || 'Belum tersedia.'}
          </p>
        </section>

        {/* Catatan */}
        <section className="mt-8">
          <div className="border border-dashed border-dervora-dark/30 bg-dervora-blush/20 rounded-2xl p-5">
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-2">
              ⚠️ Catatan
            </h3>
            <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
              {product.notes || 'Belum tersedia.'}
            </p>
          </div>
        </section>

        {/* Info Produk */}
        <section className="mt-8">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Info Produk
          </h2>
          <div className="grid grid-cols-2 gap-4 font-body text-sm text-dervora-dark/80">
            <div>
              <span className="block text-dervora-dark/50">Ukuran</span>
              {product.size || '-'}
            </div>
            <div>
              <span className="block text-dervora-dark/50">BPOM</span>
              {product.bpom || '-'}
            </div>
            <div>
              <span className="block text-dervora-dark/50">Halal</span>
              {product.halal ? '✓ Halal' : '-'}
            </div>
            <div>
              <span className="block text-dervora-dark/50">Kategori</span>
              {product.category?.name || '-'}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};