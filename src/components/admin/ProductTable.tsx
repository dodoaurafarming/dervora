import React from 'react';
import { PackageX } from 'lucide-react';
import type { Product } from '../../lib/api';
import { ProductTableRow } from './ProductTableRow';
import { ProductTableSkeleton } from './ProductTableSkeleton';
import { Pagination } from './Pagination';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
  onRetry: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  onRetry,
}) => {
  // Loading State
  if (loading) {
    return <ProductTableSkeleton />;
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="font-body text-red-700 mb-4">Gagal memuat produk: {error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-dervora-primary text-dervora-cream font-body text-sm hover:bg-dervora-primary-dark transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-dervora-beige p-12 text-center">
        <PackageX
          size={48}
          className="mx-auto text-dervora-dark/20 mb-4"
        />
        <p className="font-heading text-xl text-dervora-dark/60 mb-2">
          Belum ada produk
        </p>
        <p className="font-body text-sm text-dervora-dark/50">
          Tambahkan produk pertama Anda dengan tombol &quot;+ Tambah Produk&quot;.
        </p>
      </div>
    );
  }

  // Table
  return (
    <div className="bg-white rounded-2xl border border-dervora-beige overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-dervora-cream/50">
            <tr>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-4 text-left font-heading text-sm font-bold text-dervora-primary uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onRestore={onRestore}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};