import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Check } from 'lucide-react';
import { useIngredientById } from '../../hooks/useIngredients';
import { Button } from '../../components/ui/Button';

export const IngredientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientId = id ? parseInt(id, 10) : null;
  const { ingredient, loading, error } = useIngredientById(ingredientId);

  if (loading) {
    return (
      <div className="min-h-screen bg-dervora-cream flex items-center justify-center">
        <p className="font-heading italic text-xl text-dervora-dark/60">Memuat...</p>
      </div>
    );
  }

  if (error || !ingredient) {
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
        <Link
          to="/ingredients"
          className="inline-flex items-center gap-2 font-body text-sm text-dervora-dark/70 hover:text-dervora-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Ingredients
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-dervora-beige/30">
            {ingredient.photoUrl ? (
              <img
                src={ingredient.photoUrl}
                alt={ingredient.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FlaskConical size={80} className="text-dervora-primary/40" />
              </div>
            )}
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-dervora-blush text-dervora-dark rounded-full font-body text-xs uppercase tracking-wider">
              Ingredient
            </span>

            <h1 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary mt-4 leading-tight">
              {ingredient.name}
            </h1>

            {ingredient.function && (
              <p className="font-body text-base text-dervora-dark/80 mt-4 leading-relaxed">
                {ingredient.function}
              </p>
            )}
          </div>
        </div>

        {ingredient.description && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Deskripsi
            </h2>
            <p className="font-body text-base text-dervora-dark/80 leading-relaxed">
              {ingredient.description}
            </p>
          </section>
        )}

        {ingredient.suitableSkin && ingredient.suitableSkin.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Cocok Untuk
            </h2>
            <div className="flex flex-wrap gap-2">
              {ingredient.suitableSkin.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-dervora-blush/50 text-dervora-dark rounded-full font-body text-sm"
                >
                  <Check size={14} className="text-dervora-primary" />
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {ingredient.concerns && ingredient.concerns.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-3">
              Membantu Mengatasi
            </h2>
            <div className="flex flex-wrap gap-2">
              {ingredient.concerns.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-dervora-beige text-dervora-dark rounded-full font-body text-sm"
                >
                  <Check size={14} className="text-dervora-primary" />
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {ingredient.sourceLink && (
          <section className="mt-8">
            <p className="font-body text-sm text-dervora-dark/60">
              Sumber:{' '}
              <a
                href={ingredient.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dervora-primary underline hover:no-underline"
              >
                {ingredient.sourceLink}
              </a>
            </p>
          </section>
        )}
      </div>
    </div>
  );
};