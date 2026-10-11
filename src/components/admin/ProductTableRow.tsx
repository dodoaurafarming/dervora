import React from 'react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import type { Product } from '../../lib/api';

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const isDeleted = product.deletedAt !== null;

  return (
    <tr
      className={`border-b border-dervora-beige/50 last:border-0 hover:bg-dervora-cream/30 transition-colors ${
        isDeleted ? 'opacity-60' : ''
      }`}
    >
      {/* ID */}
      <td className="px-6 py-4 font-body text-sm text-dervora-dark/60">
        #{product.id}
      </td>

      {/* Image + Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover bg-dervora-beige/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-dervora-beige/30 flex items-center justify-center">
              <span className="font-body text-[10px] text-dervora-dark/40">—</span>
            </div>
          )}
          <div>
            <p className="font-body text-sm font-medium text-dervora-dark line-clamp-1">
              {product.name}
            </p>
            {isDeleted && (
              <span className="font-body text-[10px] text-red-500 font-medium">
                DIHAPUS
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Brand */}
      <td className="px-6 py-4 font-body text-sm text-dervora-dark/70">
        {product.brand?.name || '—'}
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        {product.category ? (
          <span className="inline-block px-3 py-1 rounded-full bg-dervora-cream text-dervora-primary font-body text-xs font-medium">
            {product.category.name}
          </span>
        ) : (
          <span className="font-body text-sm text-dervora-dark/40">—</span>
        )}
      </td>

      {/* Price */}
      <td className="px-6 py-4 font-body text-sm font-semibold text-dervora-primary whitespace-nowrap">
        {product.price ? `Rp ${product.price.toLocaleString('id-ID')}` : '—'}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          {isDeleted ? (
            <button
              onClick={() => onRestore(product)}
              className="p-2 rounded-lg hover:bg-dervora-primary/10 text-dervora-primary transition-colors"
              aria-label="Restore"
              title="Restore"
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <>
              <button
                onClick={() => onEdit(product)}
                className="p-2 rounded-lg hover:bg-dervora-primary/10 text-dervora-primary transition-colors"
                aria-label="Edit"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};