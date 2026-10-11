import React from 'react';
import { Package, Tag, Folder, FlaskConical, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { StatsCardSkeleton } from '../../components/admin/StatsCardSkeleton';
import { useAdminStats } from '../../hooks/useAdminStats';
import { getUser } from '../../lib/auth';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
};

const getFormattedDate = (): string => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

export const DashboardPage: React.FC = () => {
  const { stats, loading, error, refetch } = useAdminStats();
  const user = getUser();

  return (
    <AdminLayout>
      {/* Header Dashboard */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <p className="font-body text-xs text-dervora-dark/50 mb-2">
          <span className="text-dervora-primary">Admin</span>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
        </p>

        {/* Judul + Greeting */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary">
          Dashboard
        </h1>
        <p className="font-body text-base text-dervora-dark/70 mt-2">
          {getGreeting()}, <span className="font-semibold text-dervora-primary">{user?.username || 'Admin'}</span>! 👋
        </p>
        <p className="font-body text-sm text-dervora-dark/50 mt-1">
          {getFormattedDate()}
        </p>
      </div>

      {/* Stats Section */}
      <section>
        {/* Section Title + Refetch Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-dervora-primary">
            Statistik
          </h2>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-dervora-beige text-dervora-dark font-body text-sm hover:border-dervora-primary hover:text-dervora-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && !stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="font-body text-red-700 mb-3">
              Gagal memuat statistik: {error}
            </p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm hover:bg-dervora-primary-dark transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatsCard
              label="Total Produk"
              value={stats.totalProducts}
              icon={Package}
            />
            <StatsCard
              label="Total Brand"
              value={stats.totalBrands}
              icon={Tag}
            />
            <StatsCard
              label="Total Kategori"
              value={stats.totalCategories}
              icon={Folder}
            />
            <StatsCard
              label="Total Ingredients"
              value={stats.totalIngredients}
              icon={FlaskConical}
            />
          </div>
        )}
      </section>

      {/* Placeholder untuk Tabel Produk */}
      <section className="mt-10">
        <div className="bg-white rounded-2xl border border-dashed border-dervora-beige p-12 text-center">
          <p className="font-heading text-xl text-dervora-dark/50">
            Tabel Produk akan dibangun di Fase B4.3c
          </p>
        </div>
      </section>
    </AdminLayout>
  );
};