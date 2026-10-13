import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { IngredientTable } from '../../components/admin/IngredientTable';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { IngredientFormModal } from '../../components/admin/IngredientFormModal';
import { useAdminIngredients } from '../../hooks/useAdminIngredients';
import { useDebounce } from '../../hooks/useDebounce';
import {
  isApiSuccess,
  adminDeleteIngredient,
  type AdminIngredient,
} from '../../lib/api';

export const AdminIngredientsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { ingredients, loading, error, meta, refetch } = useAdminIngredients({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  // Reset page saat search berubah
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState<AdminIngredient | null>(null);

  // Confirm delete
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    ingredient: AdminIngredient | null;
  }>({ isOpen: false, ingredient: null });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ingredient: AdminIngredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handleDeleteClick = (ingredient: AdminIngredient) => {
    setConfirmDialog({ isOpen: true, ingredient });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.ingredient) return;

    setConfirmLoading(true);
    const toastId = toast.loading('Menghapus ingredient...');

    const response = await adminDeleteIngredient(confirmDialog.ingredient.id);

    if (isApiSuccess(response)) {
      toast.success('Ingredient berhasil dihapus!', { id: toastId });
      refetch();
      setConfirmDialog({ isOpen: false, ingredient: null });
    } else {
      toast.error(`Gagal: ${response.error.message}`, { id: toastId });
    }

    setConfirmLoading(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-xs text-dervora-dark/50 mb-2">
          <Link
            to="/dervora-control-9k2x/dashboard"
            className="text-dervora-primary hover:underline"
          >
            Admin
          </Link>
          <span className="mx-2">/</span>
          <span>Ingredients</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary">
              Kelola Ingredients
            </h1>
            <p className="font-body text-sm text-dervora-dark/60 mt-2">
              {meta?.total !== undefined
                ? `Total ${meta.total} ingredient`
                : 'Kelola semua ingredient Dervora'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dervora-control-9k2x/dashboard">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-dervora-beige text-dervora-dark font-body text-sm hover:border-dervora-primary transition-colors">
                <ArrowLeft size={14} />
                Dashboard
              </button>
            </Link>
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-dervora-beige text-dervora-dark font-body text-sm hover:border-dervora-primary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleAddIngredient}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm font-medium hover:bg-dervora-primary-dark transition-colors shadow-sm"
            >
              <Plus size={16} />
              Tambah Ingredient
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <AdminSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Cari ingredient..."
        />
      </div>

      {/* Table */}
      <IngredientTable
        ingredients={ingredients}
        loading={loading}
        error={error}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRetry={refetch}
      />

      {/* Ingredient Form Modal */}
      <IngredientFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editIngredient={editingIngredient}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, ingredient: null })}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
        variant="danger"
        title="Hapus Ingredient?"
        message={`Yakin ingin menghapus "${confirmDialog.ingredient?.name}"? Tindakan ini tidak bisa dibatalkan.`}
        confirmText="Ya, Hapus"
      />
    </AdminLayout>
  );
};