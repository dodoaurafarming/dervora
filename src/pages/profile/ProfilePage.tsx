import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Heart,
  ClipboardList,
  ChevronRight,
  Droplet,
  LogIn,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { calculateSkinProfile, CONCERN_LABELS } from '../../utils/quizScoring';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { answers, completed } = useQuizStore();
  const { user, isLoading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const profile = useMemo(() => calculateSkinProfile(answers), [answers]);

  // ===== STATE UNTUK MODAL LOGOUT =====
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Buka modal dengan animasi halus
  const openLogoutModal = () => {
    setShowLogoutModal(true);
    // Tunggu satu frame agar transisi opacity/scale berjalan
    requestAnimationFrame(() => setModalVisible(true));
  };

  // Tutup modal dengan animasi halus
  const closeLogoutModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowLogoutModal(false), 200); // sinkron dengan duration-200
  };

  // Konfirmasi logout → tutup modal, lalu proses logout
  const confirmLogout = async () => {
    setModalVisible(false);
    setTimeout(async () => {
      setShowLogoutModal(false);
      await logout();
      navigate('/');
    }, 200);
  };

  // Tutup modal saat tekan tombol Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutModal) closeLogoutModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showLogoutModal]);

  // ===== STATE: BELUM LOGIN =====
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-dervora-cream px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-dervora-beige max-w-md w-full">
          <div className="w-16 h-16 bg-dervora-primary/10 rounded-full flex items-center justify-center text-dervora-primary mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-dervora-primary mb-2">
            Akses Terbatas
          </h1>
          <p className="font-body text-dervora-dark/60 mb-6">
            Silakan masuk terlebih dahulu untuk melihat dan mengelola profil Dervora Anda.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-dervora-primary text-dervora-cream rounded-full font-heading font-semibold hover:bg-dervora-primary-dark transition-all shadow-md"
          >
            <LogIn size={20} />
            Masuk dengan Google
          </button>
        </div>
      </div>
    );
  }

  // ===== STATE: SUDAH LOGIN =====
  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Header Profil Dinamis */}
        <div className="flex items-center gap-6 mb-10 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-dervora-beige">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name || 'Profile'}
              className="w-20 h-20 rounded-full object-cover border-2 border-dervora-primary flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 bg-dervora-primary/10 rounded-full flex items-center justify-center text-dervora-primary flex-shrink-0 border-2 border-dervora-primary/20">
              <User size={40} />
            </div>
          )}
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary">
              Halo, {user?.name?.split(' ')[0] || 'Pengguna'}!
            </h1>
            <p className="font-body text-dervora-dark/60 mt-1">{user?.email}</p>
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
                      <span
                        key={i}
                        className="px-3 py-1 bg-dervora-blush text-dervora-dark text-xs rounded-full"
                      >
                        {CONCERN_LABELS[c] || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to="/skin-profile"
                className="inline-block mt-6 text-dervora-primary font-body text-sm font-semibold underline"
              >
                Lihat Detail Skin Profile
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="font-body text-sm text-dervora-dark/60 mb-4">
                Kamu belum mengisi Skin Quiz.
              </p>
              <Link
                to="/quiz"
                className="text-dervora-primary font-body text-sm font-semibold underline"
              >
                Ikuti Quiz Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Menu Navigasi Profil */}
        <div className="space-y-3">
          <Link
            to="/my-routine"
            className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-dervora-beige hover:border-dervora-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <Heart size={20} className="text-dervora-primary" />
              <span className="font-body font-medium text-dervora-dark">Rutinitas Saya</span>
            </div>
            <ChevronRight size={20} className="text-dervora-dark/40" />
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-dervora-beige hover:border-dervora-primary transition-colors"
          >
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-dervora-primary" />
              <span className="font-body font-medium text-dervora-dark">Pengaturan Aplikasi</span>
            </div>
            <ChevronRight size={20} className="text-dervora-dark/40" />
          </Link>

          {/* ===== MENU LOGOUT (Baru) ===== */}
          <button
            onClick={openLogoutModal}
            className="w-full flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-dervora-beige hover:border-red-300 hover:bg-red-50/40 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <LogOut
                size={20}
                className="text-red-500 group-hover:text-red-600 transition-colors"
              />
              <span className="font-body font-medium text-red-600">Keluar dari Akun</span>
            </div>
            <ChevronRight size={20} className="text-red-400/60" />
          </button>
        </div>
      </div>

      {/* ===== MODAL KONFIRMASI LOGOUT ===== */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={closeLogoutModal}
            className={`absolute inset-0 bg-dervora-dark/40 backdrop-blur-sm transition-opacity duration-200 ${
              modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Card Modal */}
          <div
            className={`relative w-full max-w-md bg-dervora-cream rounded-3xl shadow-2xl border border-dervora-beige p-8 md:p-10 transition-all duration-200 ${
              modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Ikon Peringatan */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                <AlertCircle size={30} className="text-red-500" />
              </div>
            </div>

            {/* Judul */}
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dervora-primary text-center mb-2">
              Keluar dari Akun?
            </h2>

            {/* Deskripsi */}
            <p className="font-body text-dervora-dark/70 text-center text-sm md:text-base leading-relaxed mb-2">
              Kamu akan keluar dari akun{' '}
              <span className="font-semibold text-dervora-dark">
                {user?.name?.split(' ')[0] || 'ini'}
              </span>
              .
            </p>
            <p className="font-body text-dervora-dark/50 text-center text-xs md:text-sm leading-relaxed mb-8">
              Tenang saja — Skin Profile, Rutinitas, dan data kamu tetap aman tersimpan. Kamu bisa
              login kembali kapan saja.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-dervora-dark bg-white border border-dervora-beige hover:border-dervora-primary hover:text-dervora-primary transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};