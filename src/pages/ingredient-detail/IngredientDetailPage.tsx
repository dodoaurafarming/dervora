import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';
import { useCatalogDetail } from '../../hooks/useIngredients';
import { Button } from '../../components/ui/Button';
import { ProductCard } from '../../components/product/ProductCard';

export const IngredientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const catalogId = id ? parseInt(id, 10) : undefined;
  const { detail, loading, error } = useCatalogDetail(catalogId);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-dervora-cream flex items-center justify-center">
        <p className="font-heading italic text-xl text-dervora-dark/60">Memuat...</p>
      </div>
    );
  }

  // Error / Not Found
  if (error || !detail) {
    return (
      <div className="min-h-screen bg-dervora-cream flex flex-col items-center justify-center px-6 py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-4">
          Ingredient tidak ditemukan
        </h1>
        <p className="font-body text-base text-dervora-dark/70 mb-8">
          {error || 'Ingredient yang kamu cari tidak tersedia.'}
        </p>
        <Link to="/ingredients">
          <Button variant="primary" size="lg">
            Kembali ke Ingredients
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dervora-cream px-6 md:px-12 lg:px-20 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/ingredients"
          className="inline-flex items-center gap-2 font-body text-sm text-dervora-dark/70 hover:text-dervora-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Ingredients
        </Link>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Foto */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-dervora-beige/30">
            {detail.photoUrl ? (
              <img
                src={detail.photoUrl}
                alt={detail.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FlaskConical size={80} className="text-dervora-primary/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 bg-dervora-blush text-dervora-dark rounded-full font-body text-xs uppercase tracking-wider">
                {detail.category || 'Ingredient'}
              </span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary leading-tight">
              {detail.name}
            </h1>

            {detail.skinTypeSummary && (
              <p className="font-body text-base text-dervora-dark/70 mt-3 italic">
                {detail.skinTypeSummary}
              </p>
            )}
          </div>
        </div>

        {/* Deskripsi */}
        {detail.description && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Deskripsi
            </h2>
            <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
              {detail.description}
            </p>
          </section>
        )}

        {/* Common Uses */}
        {detail.commonUses && detail.commonUses.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3 flex items-center gap-2">
              <BookOpen size={20} className="text-dervora-primary" />
              Kegunaan Umum
            </h2>
            <ul className="space-y-2">
              {detail.commonUses.map((use, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 font-body text-base text-dervora-dark/80"
                >
                  <span className="text-dervora-primary mt-1.5">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Allergy Potential */}
        {detail.allergyPotential && (
          <section className="mt-8">
            <div className="border border-dashed border-amber-400 bg-amber-50 rounded-2xl p-5">
              <h3 className="font-heading text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600" />
                Potensi Alergi
              </h3>
              <p className="font-body text-sm text-amber-900/80 leading-relaxed">
                {detail.allergyPotential}
              </p>
            </div>
          </section>
        )}

        {/* Risk/Benefit Analysis */}
        {detail.riskBenefit && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Analisis Risiko & Manfaat
            </h2>
            <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
              {detail.riskBenefit}
            </p>
          </section>
        )}

        {/* Source Link */}
        {detail.sourceLink && (
          <section className="mt-8">
            <p className="font-body text-sm text-dervora-dark/60">
              Sumber:{' '}
              <a
                href={detail.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dervora-primary underline hover:no-underline inline-flex items-center gap-1"
              >
                {detail.sourceLink}
                <ExternalLink size={12} />
              </a>
            </p>
          </section>
        )}

        {/* Produk Terkait */}
        {detail.products && detail.products.length > 0 && (
          <section className="mt-16 pt-8 border-t border-dervora-beige">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary">
                Produk dengan {detail.name}
              </h2>
              <span className="font-body text-sm text-dervora-dark/60">
                {detail.products.length} produk
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {detail.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};