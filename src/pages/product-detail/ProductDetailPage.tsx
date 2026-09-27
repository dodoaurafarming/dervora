import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts } from '../../data/mockProducts';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getImageUrl } from '../../utils/imageUrl';
import { Heart, Star, ArrowLeft, Check } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="font-heading text-2xl text-dervora-primary">Produk tidak ditemukan.</p>
        <Link to="/products" className="mt-4 inline-block text-dervora-primary underline">
          Kembali ke Products
        </Link>
      </div>
    );
  }

  // Helper untuk rendering bintang
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
        />
      );
    }
    return stars;
  };

  // Fallback pengamanan URL gambar (sama seperti yang ada di ProductCard)
  const imageSrc = product.image.startsWith('http') || product.image.startsWith('/') 
    ? product.image 
    : getImageUrl(product.image);

  return (
    <div className="min-h-screen bg-dervora-cream px-6 md:px-12 lg:px-20 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Tombol Back */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-dervora-dark/70 hover:text-dervora-primary mb-8 font-body text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        {/* Layout Utama (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Kolom Kiri: Gambar Produk */}
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-dervora-beige/30">
            <img 
              src={imageSrc} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Kolom Kanan: Info Produk */}
          <div>
            <span className="inline-block px-3 py-1 bg-dervora-blush text-dervora-dark rounded-full font-body text-xs uppercase tracking-wider">
              {product.category}
            </span>
            
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary mt-4 leading-tight">
              {product.name}
            </h1>
            
            <p className="font-body text-base text-dervora-dark/70 mt-2">
              {product.brand}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="font-body text-sm text-dervora-dark/60">
                {product.rating} ({product.reviewCount} ulasan)
              </span>
            </div>
            
            <p className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mt-4">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            
            <div className="mt-4">
              <Badge label={`${product.matchScore}% Match`} type="match" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="primary" size="lg" className="whitespace-nowrap">
                <Heart size={18} className="inline mr-2" />
                Tambah ke Rutinitas
              </Button>
              <Button variant="outline" size="lg" className="whitespace-nowrap">
                Beli Sekarang
              </Button>
            </div>

            {/* Section di Bawah (Setelah Action Buttons) */}
            <section className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">Deskripsi</h2>
              <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
                {product.description}
              </p>
            </section>
            
            <section className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">Key Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="px-3 py-1 bg-dervora-beige text-dervora-dark rounded-full font-body text-sm">
                    {ing}
                  </span>
                ))}
              </div>
            </section>
            
            <section className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">Cocok Untuk</h2>
              <div className="flex flex-wrap gap-2">
                {product.skinTypes.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-dervora-blush/50 text-dervora-dark rounded-full font-body text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </section>
            
            <section className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">Cara Pakai</h2>
              <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
                {product.howToUse}
              </p>
            </section>
            
            <section className="mt-8">
              <div className="border border-dashed border-dervora-dark/30 bg-dervora-blush/20 rounded-2xl p-5">
                <h3 className="font-heading text-lg font-bold text-dervora-primary mb-2">⚠️ Catatan</h3>
                <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
                  {product.notes}
                </p>
              </div>
            </section>
            
            <section className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">Info Produk</h2>
              <div className="grid grid-cols-2 gap-4 font-body text-sm text-dervora-dark/80">
                <div><span className="block text-dervora-dark/50">Ukuran</span>{product.size}</div>
                <div><span className="block text-dervora-dark/50">BPOM</span>{product.bpom}</div>
                <div><span className="block text-dervora-dark/50">Halal</span>{product.halal ? '✓ Halal' : 'Tidak'}</div>
                <div><span className="block text-dervora-dark/50">Kategori</span>{product.category}</div>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
};