import React from 'react';
import { PackageX } from 'lucide-react';
import type { AdminIngredient } from '../../lib/api';
import { IngredientTableRow } from './IngredientTableRow';
import { IngredientTableSkeleton } from './IngredientTableSkeleton';
import { Pagination } from './Pagination';

interface IngredientTableProps {
  ingredients: AdminIngredient[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (ingredient: AdminIngredient) => void;
  onDelete: (ingredient: AdminIngredient) => void;
  onRetry: () => void;
}

export const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onRetry,
}) => {
  if (loading) return <IngredientTableSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="font-body text-red-700 mb-4">Gagal memuat ingredients: {error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-dervora-beige p-12 text-center">
        <PackageX size={48} className="mx-auto text-dervora-dark/20 mb-4" />
        <p className="font-heading text-xl text-dervora-dark/60 mb-2">
          Belum ada ingredient
        </p>
        <p className="font-body text-sm text-dervora-dark/50">
          Tambahkan ingredient pertama Anda dengan tombol &quot;+ Tambah Ingredient&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dervora-beige overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-dervora-cream/50">
            <tr>
              <th className="hidden md:table-cell px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Ingredient
              </th>
              <th className="hidden sm:table-cell px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Fungsi
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <IngredientTableRow
                key={ingredient.id}
                ingredient={ingredient}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};