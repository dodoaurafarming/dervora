import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Heart, ClipboardList, ChevronRight, Droplet } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { calculateSkinProfile, CONCERN_LABELS } from '../../utils/quizScoring';

export const ProfilePage: React.FC = () => {
  const { answers, completed } = useQuizStore();

  // Hitung profil kulit berdasarkan jawaban quiz
  const profile = useMemo(() => calculateSkinProfile(answers), [answers]);

  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Header Profil */}
        <div className="flex items-center gap-6 mb-10 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-dervora-beige">
          <div className="w-20 h-20 bg-dervora-primary/10 rounded-full flex items-center justify-center text-dervora-primary flex-shrink-0">
            <User size={40} />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary">
              Halo, Skincare Enthusiast!
            </h1>
            <p className="font-body text-dervora-dark/60 mt-1">
              Selamat datang di profil Dervora kamu.
            </p>
          </div>
        </div>

        {/* Ringkasan Skin Profile */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-dervora-beige mb-8">
          <h2 className="font-heading text-xl font-bold text-dervora-dark mb-4 flex items-center gap-2">
            <ClipboardList size={20} className="text-dervora-primary" />
            Skin Profile Kamu
          </h2>
          
          {completed ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-dervora-primary/10 flex items-center justify-center">
                  <Droplet size={24} className="text-dervora-primary" />
                </div>
                <div>
                  <p className="font-body text-xs text-dervora-dark/50 uppercase">Tipe Kulit</p>
                  <span className="inline-block font-heading text-xl font-bold text-dervora-primary">
                    {profile.skinType}
                  </span>
                </div>
              </div>
              
              {profile.concerns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="font-body text-sm text-dervora-dark/70 mb-2">Fokus perawatanmu:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.concerns.map((c: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-dervora-blush text-dervora-dark text-xs rounded-full">
                        {CONCERN_LABELS[c] || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Link to="/skin-profile" className="inline-block mt-6 text-dervora-primary font-body text-sm font-semibold underline">
                Lihat Detail Skin Profile
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="font-body text-sm text-dervora-dark/60 mb-4">
                Kamu belum mengisi Skin Quiz.
              </p>
              <Link to="/quiz" className="text-dervora-primary font-body text-sm font-semibold underline">
                Ikuti Quiz Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Menu Navigasi Profil */}
        <div className="space-y-3">
          <Link to="/my-routine" className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-dervora-beige hover:border-dervora-primary transition-colors">
            <div className="flex items-center gap-4">
              <Heart size={20} className="text-dervora-primary" />
              <span className="font-body font-medium text-dervora-dark">Rutinitas Saya</span>
            </div>
            <ChevronRight size={20} className="text-dervora-dark/40" />
          </Link>

          <Link to="/settings" className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-dervora-beige hover:border-dervora-primary transition-colors">
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-dervora-primary" />
              <span className="font-body font-medium text-dervora-dark">Pengaturan Aplikasi</span>
            </div>
            <ChevronRight size={20} className="text-dervora-dark/40" />
          </Link>
        </div>
      </div>
    </div>
  );
};