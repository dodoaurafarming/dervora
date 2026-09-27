import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ArrowLeft } from 'lucide-react';
import { mockProducts } from '../../data/mockProducts';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-dervora-cream flex flex-col items-center justify-center px-6 py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-4">
          Produk tidak ditemukan
        </h1>
        <p className="font-body text-base text-dervora-dark/70 mb-8">
          Produk yang kamu cari tidak tersedia.
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
        className={i < Math.floor(rating) ? 'text-dervora-primary fill-dervora-primary' : 'text-dervora-dark/30'}
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
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Kolom Kanan: Info */}
          <div>
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-dervora-blush text-dervora-dark rounded-full font-body text-xs uppercase tracking-wider">
              {product.category}
            </span>

            {/* Judul */}
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary mt-4 leading-tight">
              {product.name}
            </h1>

            {/* Brand */}
            <p className="font-body text-base text-dervora-dark/70 mt-2">
              {product.brand}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="font-body text-sm text-dervora-dark/60">
                {product.rating} ({product.reviewCount} ulasan)
              </span>
            </div>

            {/* Harga */}
            <p className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mt-4">
              Rp {product.price.toLocaleString('id-ID')}
            </p>

            {/* Match Badge */}
            <div className="mt-4">
              <Badge label={`${product.matchScore}% Match`} type="match" />
            </div>

            {/* Tombol Aksi */}
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

        {/* Section: Deskripsi */}
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Deskripsi
          </h2>
          <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
            {product.description}
          </p>
        </section>

        {/* Section: Key Ingredients */}
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
                {ing}
              </span>
            ))}
          </div>
        </section>

        {/* Section: Suitable For */}
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

        {/* Section: Cara Pakai */}
        <section className="mt-8">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Cara Pakai
          </h2>
          <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
            {product.howToUse}
          </p>
        </section>

        {/* Section: Catatan */}
        <section className="mt-8">
          <div className="border border-dashed border-dervora-dark/30 bg-dervora-blush/20 rounded-2xl p-5">
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-2">
              ⚠️ Catatan
            </h3>
            <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
              {product.notes}
            </p>
          </div>
        </section>

        {/* Section: Info Produk */}
        <section className="mt-8">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
            Info Produk
          </h2>
          <div className="grid grid-cols-2 gap-4 font-body text-sm text-dervora-dark/80">
            <div>
              <span className="block text-dervora-dark/50">Ukuran</span>
              {product.size}
            </div>
            <div>
              <span className="block text-dervora-dark/50">BPOM</span>
              {product.bpom}
            </div>
            <div>
              <span className="block text-dervora-dark/50">Halal</span>
              {product.halal ? '✓ Halal' : 'Tidak'}
            </div>
            <div>
              <span className="block text-dervora-dark/50">Kategori</span>
              {product.category}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};