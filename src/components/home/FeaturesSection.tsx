import React from 'react';
import { Sparkles, Target, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../ui/FadeIn';
import { getImageUrl } from '../../utils/imageUrl';

export const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'Skin Quiz',
      description: 'Kenali tipe dan kebutuhan kulitmu dengan kuis singkat.',
      link: '/quiz',
      image: getImageUrl('images/features/quiz.jpg'),
    },
    {
      icon: Target,
      title: 'Find Your Match',
      description: 'Temukan produk yang sesuai dengan profil kulitmu.',
      link: '/matches',
      image: getImageUrl('images/features/match.jpg'),
    },
    {
      icon: FlaskConical,
      title: 'Ingredient Checker',
      description: 'Cari tahu fungsi ingredients dalam skincare.',
      link: '/ingredients',
      image: getImageUrl('images/features/ingredient.jpg'),
    },
  ];

  return (
    <section className="w-full bg-dervora-cream pt-10 md:pt-16 pb-8 md:pb-12 px-6 md:px-12 lg:px-20">
      <FadeIn className="text-center mb-12 md:mb-16">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-dervora-primary">
          Apa yang bisa dilakukan Dervora?
        </h2>
        <p className="font-body text-base md:text-lg text-dervora-dark/70 mt-4 max-w-2xl mx-auto">
          Tiga fitur utama untuk membantumu mengenali kulit, menemukan produk, dan memahami ingredients.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <FadeIn key={index} delay={index * 0.1}>
              <div
                onClick={() => navigate(feature.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(feature.link)}
                aria-label={feature.title}
                className="group relative block h-80 rounded-2xl overflow-hidden border-4 border-dervora-cream shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer bg-dervora-beige"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-dervora-cream via-dervora-cream/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="w-12 h-12 rounded-full bg-dervora-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-dervora-cream" aria-hidden="true" />
                  </div>

                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary mb-2">
                    {feature.title}
                  </h3>

                  <p className="font-body text-sm md:text-base text-dervora-dark/80 leading-relaxed">
                    {feature.description}
                  </p>

                  <p className="mt-4 font-body text-sm font-medium text-dervora-primary underline underline-offset-4 decoration-dervora-primary/40 group-hover:decoration-dervora-primary transition-colors">
                    Coba Sekarang
                  </p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
};