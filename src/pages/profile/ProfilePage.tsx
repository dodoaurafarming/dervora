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
  ShieldCheck,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import {
  calculateSkinProfile,
  CONCERN_LABELS,
  SKIN_TYPE_LABELS,
  BARRIER_STATUS_LABELS,
} from '../../utils/quizScoring';
import { useAuth } from '../../context/AuthContext';

function formatFirstName(fullName?: string | null): string {
  if (!fullName?.trim()) return 'Pengguna';
  const first = fullName.trim().split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function getInitials(fullName?: string | null, email?: string | null): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email?.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'D';
}

export const ProfilePage: React.FC = () => {
  const { answers, completed } = useQuizStore();
  const { user, isLoading, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const profile = useMemo(() => calculateSkinProfile(answers), [answers]);

  // Fallback jika foto profil Google gagal dimuat
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.photoUrl]);

  // ===== STATE UNTUK MODAL LOGOUT =====
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeLogoutModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowLogoutModal(false), 200);
  };

  const confirmLogout = async () => {
    setModalVisible(false);
    setTimeout(async () => {
      setShowLogoutModal(false);
      await logout();
      navigate('/');
    }, 200);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutModal) closeLogoutModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showLogoutModal]);

  const firstName = formatFirstName(user?.name);
  const initials = getInitials(user?.name, user?.email);

  const barrierBadgeClass =
    profile.barrierStatus === 'compromised'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : profile.barrierStatus === 'mildly-compromised'
        ? 'bg-orange-50/80 text-orange-800 border-orange-200'
        : 'bg-dervora-primary/10 text-dervora-primary border-dervora-primary/20';

  // ===== STATE: LOADING =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dervora-cream px-5 sm:px-6 pt-8 pb-28 md:py-20">
        <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-dervora-beige flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-dervora-beige/60 flex-shrink-0" />
            <div className="space-y-2.5 w-full flex flex-col items-center sm:items-start">
              <div className="h-7 w-40 bg-dervora-beige/60 rounded-lg" />
              <div className="h-4 w-56 bg-dervora-beige/50 rounded-lg" />
            </div>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-dervora-beige h-56" />
          <div className="space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-dervora-beige h-16" />
            <div className="bg-white p-5 rounded-2xl border border-dervora-beige h-16" />
          </div>
        </div>
      </div>
    );
  }

  // ===== STATE: BELUM LOGIN =====
  if (!user) {
    return (
      <div className="min-h-screen bg-dervora-cream px-5 sm:px-6 pt-12 pb-28 md:py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-dervora-beige max-w-md w-full">
          <div className="w-16 h-16 bg-dervora-primary/10 rounded-full flex items-center justify-center text-dervora-primary mx-auto mb-5 ring-4 ring-dervora-cream">
            <User size={30} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dervora-primary mb-2">
            Akses Terbatas
          </h1>
          <p className="font-body text-sm sm:text-base text-dervora-dark/65 leading-relaxed mb-7">
            Silakan masuk terlebih dahulu untuk melihat Skin Profile, rutinitas, dan pengaturan akun
            Dervora Anda.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-dervora-primary text-dervora-cream rounded-full font-heading font-semibold hover:bg-dervora-primary-dark transition-all shadow-sm hover:shadow-md"
          >
            <LogIn size={18} />
            Masuk dengan Google
          </button>
        </div>
      </div>
    );
  }

  // ===== STATE: SUDAH LOGIN =====
  return (
    <div className="min-h-screen bg-dervora-cream px-5 sm:px-6 pt-8 pb-28 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header Profil Elegan & Anti-Overflow */}
        <section className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-dervora-beige mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
            {/* Avatar dengan Fallback Monogram */}
            {user.photoUrl && !imgError ? (
              <img
                src={user.photoUrl}
                alt={firstName}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-20 h-20 rounded-full object-cover border-2 border-dervora-primary/30 ring-4 ring-dervora-cream flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-dervora-primary text-dervora-cream flex items-center justify-center font-heading text-2xl font-bold tracking-wide ring-4 ring-dervora-cream flex-shrink-0 select-none">
                {initials}
              </div>
            )}

            {/* Identitas User (min-w-0 mencegah overflow di flex) */}
            <div className="min-w-0 flex-1 w-full">
              <p className="font-body text-[11px] uppercase tracking-[0.16em] text-dervora-primary/70 font-semibold mb-1">
                Dervora Member
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dervora-primary leading-tight truncate">
                Halo, {firstName}!
              </h1>

              {user.email && (
                <div className="mt-2 inline-flex items-center justify-center sm:justify-start gap-1.5 max-w-full px-3 py-1 rounded-full bg-dervora-cream/80 border border-dervora-beige/70">
                  <Mail size={13} className="text-dervora-primary/70 flex-shrink-0" />
                  <p
                    title={user.email}
                    className="font-body text-xs sm:text-sm text-dervora-dark/70 break-all sm:truncate leading-snug"
                  >
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ringkasan Skin Profile */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-dervora-beige mb-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-dervora-dark flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-dervora-primary/10 flex items-center justify-center text-dervora-primary flex-shrink-0">
                <ClipboardList size={17} />
              </span>
              Skin Profile Kamu
            </h2>
          </div>

          {completed ? (
            <div>
              {/* Kartu Tipe Kulit & Status Barrier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-dervora-cream/60 border border-dervora-beige/70">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-dervora-beige flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Droplet size={22} className="text-dervora-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-[11px] text-dervora-dark/55 uppercase tracking-wider font-medium">
                      Tipe Kulit
                    </p>
                    <p className="font-heading text-xl sm:text-2xl font-bold text-dervora-primary leading-tight">
                      {profile.skinType}
                    </p>
                    <p className="font-body text-xs text-dervora-dark/60">
                      {SKIN_TYPE_LABELS[profile.skinType]}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-full border text-xs font-body font-medium ${barrierBadgeClass}`}
                >
                  <ShieldCheck size={14} className="flex-shrink-0" />
                  <span>Barrier: {BARRIER_STATUS_LABELS[profile.barrierStatus]}</span>
                </div>
              </div>

              {profile.concerns.length > 0 && (
                <div className="mt-5 pt-5 border-t border-dervora-beige/60">
                  <p className="font-body text-xs uppercase tracking-wider text-dervora-dark/55 font-medium mb-3">
                    Fokus Perawatanmu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.concerns.map((c: string) => (
                      <span
                        key={c}
                        className="px-3.5 py-1.5 bg-dervora-blush/80 text-dervora-dark font-body text-xs font-medium rounded-full border border-dervora-beige/50"
                      >
                        {CONCERN_LABELS[c] || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-dervora-beige/60 flex items-center justify-between">
                <Link
                  to="/skin-profile"
                  className="inline-flex items-center gap-1.5 text-dervora-primary hover:text-dervora-primary-dark font-body text-sm font-semibold transition-colors group"
                >
                  Lihat Detail Skin Profile
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/quiz"
                  className="font-body text-xs text-dervora-dark/55 hover:text-dervora-primary underline underline-offset-4 transition-colors"
                >
                  Ulangi Quiz
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 px-4 rounded-2xl bg-dervora-cream/50 border border-dashed border-dervora-beige">
              <p className="font-body text-sm text-dervora-dark/65 mb-4">
                Kamu belum mengisi Skin Quiz untuk mendapatkan rekomendasi personal.
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-dervora-primary text-dervora-cream rounded-full font-body text-sm font-semibold hover:bg-dervora-primary-dark transition-colors"
              >
                Ikuti Quiz Sekarang
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>

        {/* Menu Navigasi Profil */}
        <section className="bg-white rounded-3xl shadow-sm border border-dervora-beige overflow-hidden divide-y divide-dervora-beige/60">
          <Link
            to="/my-routine"
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-dervora-cream/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-dervora-primary/10 text-dervora-primary flex items-center justify-center flex-shrink-0 group-hover:bg-dervora-primary group-hover:text-dervora-cream transition-colors">
                <Heart size={18} />
              </span>
              <div className="min-w-0">
                <span className="block font-body text-sm sm:text-base font-medium text-dervora-dark">
                  Rutinitas Saya
                </span>
                <span className="block font-body text-xs text-dervora-dark/50">
                  Kelola jadwal skincare pagi & malam
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-dervora-dark/35 group-hover:text-dervora-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </Link>

          <Link
            to="/settings"
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-dervora-cream/50 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-dervora-primary/10 text-dervora-primary flex items-center justify-center flex-shrink-0 group-hover:bg-dervora-primary group-hover:text-dervora-cream transition-colors">
                <Settings size={18} />
              </span>
              <div className="min-w-0">
                <span className="block font-body text-sm sm:text-base font-medium text-dervora-dark">
                  Pengaturan Aplikasi
                </span>
                <span className="block font-body text-xs text-dervora-dark/50">
                  Preferensi akun dan tampilan
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-dervora-dark/35 group-hover:text-dervora-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </Link>

          <button
            onClick={openLogoutModal}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-red-50/60 transition-colors group text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut size={18} />
              </span>
              <div className="min-w-0">
                <span className="block font-body text-sm sm:text-base font-medium text-red-600">
                  Keluar dari Akun
                </span>
                <span className="block font-body text-xs text-red-500/70">
                  Akhiri sesi login di perangkat ini
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-red-400/60 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </button>
        </section>
      </div>

      {/* ===== MODAL KONFIRMASI LOGOUT ===== */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={closeLogoutModal}
            className={`absolute inset-0 bg-dervora-dark/40 backdrop-blur-sm transition-opacity duration-200 ${
              modalVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className={`relative w-full max-w-md bg-dervora-cream rounded-3xl shadow-2xl border border-dervora-beige p-7 sm:p-9 transition-all duration-200 ${
              modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="flex justify-center mb-5">
              <div className="w-15 h-15 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                <AlertCircle size={28} className="text-red-500" />
              </div>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dervora-primary text-center mb-2">
              Keluar dari Akun?
            </h2>

            <p className="font-body text-dervora-dark/70 text-center text-sm sm:text-base leading-relaxed mb-2">
              Kamu akan keluar dari akun{' '}
              <span className="font-semibold text-dervora-dark">{firstName}</span>.
            </p>
            <p className="font-body text-dervora-dark/50 text-center text-xs sm:text-sm leading-relaxed mb-7">
              Tenang saja — Skin Profile, Rutinitas, dan data kamu tetap aman tersimpan. Kamu bisa
              login kembali kapan saja.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-dervora-dark bg-white border border-dervora-beige hover:border-dervora-primary hover:text-dervora-primary transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-5 py-3 rounded-full font-heading font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut size={17} />
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};