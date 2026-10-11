import React, { useState } from 'react';
import { Package, Tag, Folder, FlaskConical, RefreshCw, Plus } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatsCard } from '../../components/admin/StatsCard';
import { StatsCardSkeleton } from '../../components/admin/StatsCardSkeleton';
import { ProductTable } from '../../components/admin/ProductTable';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { getUser } from '../../lib/auth';
import toast from 'react-hot-toast';
import type { Product } from '../../lib/api';

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
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const user = getUser();

  // Products state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    meta,
    refetch: refetchProducts,
  } = useAdminProducts({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  // Reset page saat search berubah
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Placeholder handlers (dibangun di B4.3c-3 dan B4.3c-4)
  const handleEdit = (product: Product) => {
    toast(`Edit: ${product.name} (coming soon)`);
  };

  const handleDelete = (product: Product) => {
    toast(`Delete: ${product.name} (coming soon)`);
  };

  const handleRestore = (product: Product) => {
    toast(`Restore: ${product.name} (coming soon)`);
  };

  const handleAddProduct = () => {
    toast('Tambah produk (coming soon)');
  };

  return (
    <AdminLayout>
      {/* Header Dashboard */}
      <div className="mb-8">
        <p className="font-body text-xs text-dervora-dark/50 mb-2">
          <span className="text-dervora-primary">Admin</span>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
        </p>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-dervora-primary">
            Statistik
          </h2>
          <button
            onClick={refetchStats}
            disabled={statsLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-dervora-beige text-dervora-dark font-body text-sm hover:border-dervora-primary hover:text-dervora-primary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={statsLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {statsLoading && !stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        )}

        {!statsLoading && statsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="font-body text-red-700 mb-3">
              Gagal memuat statistik: {statsError}
            </p>
            <button
              onClick={refetchStats}
              className="px-4 py-2 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm hover:bg-dervora-primary-dark transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatsCard label="Total Produk" value={stats.totalProducts} icon={Package} />
            <StatsCard label="Total Brand" value={stats.totalBrands} icon={Tag} />
            <StatsCard label="Total Kategori" value={stats.totalCategories} icon={Folder} />
            <StatsCard label="Total Ingredients" value={stats.totalIngredients} icon={FlaskConical} />
          </div>
        )}
      </section>

      {/* Product Table Section */}
      <section className="mt-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-dervora-primary">
              Daftar Produk
            </h2>
            <p className="font-body text-sm text-dervora-dark/60 mt-1">
              {meta?.total !== undefined
                ? `Total ${meta.total} produk`
                : 'Kelola semua produk Dervora'}
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm font-medium hover:bg-dervora-primary-dark transition-colors shadow-sm"
          >
            <Plus size={16} />
            Tambah Produk
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari nama produk..."
          />
        </div>

        {/* Table */}
        <ProductTable
          products={products}
          loading={productsLoading}
          error={productsError}
          page={page}
          totalPages={meta?.totalPages || 1}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onRetry={refetchProducts}
        />
      </section>
    </AdminLayout>
  );
};