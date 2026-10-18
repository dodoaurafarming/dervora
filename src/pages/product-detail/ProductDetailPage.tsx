import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct } from '../../hooks/useProducts';
import { useRoutineToggle } from '../../hooks/useRoutineToggle';
import { AddToRoutineModal } from '../../components/routine/AddToRoutineModal';
import { Button } from '../../components/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id ? parseInt(id, 10) : null);
  
  // State untuk Modal Rutinitas
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  
  // Hook untuk cek apakah produk sudah ada di rutinitas
  // Harus dipanggil di atas (sebelum early return) agar urutan hooks tidak error
  const { isInRoutine } = useRoutineToggle(product || ({} as any));

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
                {product.reviewCount || 0} Terjual)
              </span>
            </div>

            <p className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mt-4">
              {product.price
                ? `Rp ${product.price.toLocaleString('id-ID')}`
                : 'Hubungi Kami'}
            </p>

            {/* DISCLAIMER HARGA */}
            <p className="font-body text-xs text-dervora-dark/50 mt-2 italic">
              *Harga diperbarui pada Oktober 2026. Harga dapat berubah sewaktu-waktu.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {/* TOMBOL RUTINITAS YANG SUDAH BERFUNGSI */}
              <Button 
                variant={isInRoutine ? "outline" : "primary"} 
                size="lg" 
                className="whitespace-nowrap"
                onClick={() => {
                  if (isInRoutine) {
                    toast.success('Produk ini sudah ada di rutinitasmu.');
                  } else {
                    setIsRoutineModalOpen(true);
                  }
                }}
              >
                <Heart 
                  size={18} 
                  className={`inline mr-2 ${isInRoutine ? 'fill-dervora-primary text-dervora-primary' : ''}`} 
                />
                {isInRoutine ? 'Sudah di Rutinitas' : 'Tambah ke Rutinitas'}
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

        {/* Key Ingredients — CLICKABLE & VISUAL IMPROVED */}
        {product.ingredients.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary">
                Key Ingredients
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((pi, i) => {
                const catalog = pi.ingredient.catalog;

                // Kalau ingredient punya catalog → link ke catalog detail
                if (catalog) {
                  return (
                    <Link
                      key={i}
                      to={`/ingredients/${catalog.id}`}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-dervora-beige text-dervora-dark rounded-full font-body text-sm border border-transparent hover:border-dervora-primary hover:bg-dervora-blush hover:text-dervora-primary transition-all cursor-pointer"
                    >
                      {catalog.name}
                    </Link>
                  );
                }

                // Kalau tidak punya catalog → tampilkan sebagai text biasa
                return (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-dervora-beige/40 text-dervora-dark/60 rounded-full font-body text-sm"
                    title="Detail belum tersedia"
                  >
                    {pi.ingredient.name}
                  </span>
                );
              })}
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

      {/* MODAL ADD TO ROUTINE DI PALING BAWAH */}
      <AddToRoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        product={product}
        onSuccess={() => toast.success(`${product.name} ditambahkan ke rutinitas!`)}
      />
    </div>
  );
};