import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Droplet, Sun, AlertCircle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { calculateSkinProfile, CONCERN_LABELS } from '../../utils/quizScoring';
import { Button } from '../../components/ui/Button';
import { FadeIn } from '../../components/ui/FadeIn';

export const SkinProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { answers, completed, reset } = useQuizStore();

  const profile = useMemo(() => calculateSkinProfile(answers), [answers]);

  // Kalau quiz belum selesai, redirect ke quiz
  if (!completed) {
    return (
      <div className="min-h-screen bg-dervora-cream flex flex-col items-center justify-center px-6 py-16">
        <AlertCircle size={48} className="text-dervora-primary/40 mb-4" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-4">
          Quiz belum selesai
        </h1>
        <p className="font-body text-base text-dervora-dark/70 mb-8 text-center max-w-md">
          Silakan selesaikan quiz terlebih dahulu untuk melihat profil kulitmu.
        </p>
        <Link to="/quiz">
          <Button variant="primary" size="lg">
            Mulai Quiz
          </Button>
        </Link>
      </div>
    );
  }

  const handleRetake = () => {
    reset();
    navigate('/quiz');
  };

  return (
    <section className="w-full min-h-screen bg-dervora-cream py-12 md:py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-dervora-primary/10 rounded-full mb-4">
              <Sparkles size={16} className="text-dervora-primary" />
              <span className="font-body text-xs uppercase tracking-wider text-dervora-primary font-medium">
                Hasil Analisis
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
              Your Skin Profile ♡
            </h1>
            <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-4 max-w-2xl mx-auto">
              Berdasarkan jawaban quiz kamu, ini profil kulit dan rekomendasi yang bisa membantu.
            </p>
          </div>
        </FadeIn>

        {/* Main Card - Skin Type */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-3xl border border-dervora-beige shadow-sm p-6 md:p-10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Skin Type */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-dervora-primary/10 flex items-center justify-center mb-4">
                  <Droplet size={36} className="text-dervora-primary" />
                </div>
                <p className="font-body text-xs uppercase tracking-wider text-dervora-dark/50 mb-1">
                  Tipe Kulit
                </p>
                <p className="font-heading text-3xl font-bold text-dervora-primary">
                  {profile.skinType}
                </p>
                <p className="font-body text-xs text-dervora-dark/50 mt-1">
                  Score: {profile.skinTypeScore > 0 ? '+' : ''}{profile.skinTypeScore}
                </p>
              </div>

              {/* Acne-Prone */}
              <div className="text-center md:border-x border-dervora-beige">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${profile.isAcneProne ? 'bg-red-100' : 'bg-dervora-primary/10'}`}>
                  {profile.isAcneProne ? (
                    <AlertCircle size={36} className="text-red-500" />
                  ) : (
                    <CheckCircle size={36} className="text-dervora-primary" />
                  )}
                </div>
                <p className="font-body text-xs uppercase tracking-wider text-dervora-dark/50 mb-1">
                  Acne-Prone
                </p>
                <p className={`font-heading text-2xl font-bold ${profile.isAcneProne ? 'text-red-500' : 'text-dervora-primary'}`}>
                  {profile.isAcneProne ? 'Ya' : 'Tidak'}
                </p>
                <p className="font-body text-xs text-dervora-dark/50 mt-1">
                  Score: {profile.acneScore}/20
                </p>
              </div>

              {/* Sensitive */}
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${profile.isSensitive ? 'bg-amber-100' : 'bg-dervora-primary/10'}`}>
                  {profile.isSensitive ? (
                    <AlertCircle size={36} className="text-amber-500" />
                  ) : (
                    <CheckCircle size={36} className="text-dervora-primary" />
                  )}
                </div>
                <p className="font-body text-xs uppercase tracking-wider text-dervora-dark/50 mb-1">
                  Sensitive
                </p>
                <p className={`font-heading text-2xl font-bold ${profile.isSensitive ? 'text-amber-600' : 'text-dervora-primary'}`}>
                  {profile.isSensitive ? 'Ya' : 'Tidak'}
                </p>
                <p className="font-body text-xs text-dervora-dark/50 mt-1">
                  Score: {profile.sensitiveScore}/20
                </p>
              </div>
            </div>

            {/* Dehydrated + Dark Spots Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-dervora-beige">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-dervora-cream/30">
                <div className="w-10 h-10 rounded-full bg-dervora-primary/10 flex items-center justify-center flex-shrink-0">
                  <Droplet size={18} className="text-dervora-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-dervora-dark/50">Dehidrasi</p>
                  <p className={`font-heading text-lg font-bold ${profile.isDehydrated ? 'text-amber-600' : 'text-dervora-primary'}`}>
                    {profile.isDehydrated ? 'Ya, kulitmu terdehidrasi' : 'Tidak terdehidrasi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-dervora-cream/30">
                <div className="w-10 h-10 rounded-full bg-dervora-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sun size={18} className="text-dervora-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-dervora-dark/50">Dark Spots</p>
                  <p className={`font-heading text-lg font-bold ${profile.hasDarkSpots ? 'text-amber-600' : 'text-dervora-primary'}`}>
                    {profile.hasDarkSpots ? 'Ada bekas/noda' : 'Tidak ada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Concerns */}
        {profile.concerns.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-3xl border border-dervora-beige shadow-sm p-6 md:p-8 mb-6">
              <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-4">
                Main Concerns ♡
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.concerns.map((c) => (
                  <span
                    key={c}
                    className="px-4 py-2 rounded-full bg-dervora-blush/40 text-dervora-dark font-body text-sm"
                  >
                    {CONCERN_LABELS[c] || c}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 md:p-8 bg-dervora-primary/5 rounded-3xl border border-dashed border-dervora-primary/20">
            <div>
              <h3 className="font-heading text-2xl font-bold text-dervora-primary mb-1">
                Siap lihat rekomendasi produk?
              </h3>
              <p className="font-body text-sm text-dervora-dark/70">
                Kami sudah menyiapkan produk yang cocok dengan profil kulitmu.
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleRetake}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-dervora-beige text-dervora-dark font-body text-sm hover:border-dervora-primary transition-colors"
              >
                <RotateCcw size={14} />
                Ulangi Quiz
              </button>
              <Link to="/matches" className="flex-1 sm:flex-none">
                <Button variant="primary" size="lg" className="w-full whitespace-nowrap">
                  Lihat Rekomendasi
                  <ArrowRight size={16} className="inline ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};