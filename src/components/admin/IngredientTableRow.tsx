import React from 'react';
import { Pencil, Trash2, FlaskConical } from 'lucide-react';
import type { AdminIngredient } from '../../lib/api';

interface IngredientTableRowProps {
  ingredient: AdminIngredient;
  onEdit: (ingredient: AdminIngredient) => void;
  onDelete: (ingredient: AdminIngredient) => void;
}

export const IngredientTableRow: React.FC<IngredientTableRowProps> = ({
  ingredient,
  onEdit,
  onDelete,
}) => {
  const productCount = ingredient._count?.products || 0;

  return (
    <tr className="border-b border-dervora-beige/50 last:border-0 hover:bg-dervora-cream/30 transition-colors">
      {/* ID */}
      <td className="hidden md:table-cell px-6 py-4 font-body text-sm text-dervora-dark/60">
        #{ingredient.id}
      </td>

      {/* Photo + Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {ingredient.photoUrl ? (
            <img
              src={ingredient.photoUrl}
              alt={ingredient.name}
              className="w-10 h-10 rounded-lg object-cover bg-dervora-beige/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-dervora-beige/30 flex items-center justify-center">
              <FlaskConical size={18} className="text-dervora-primary/40" />
            </div>
          )}
          <div>
            <p className="font-body text-sm font-medium text-dervora-dark line-clamp-1">
              {ingredient.name}
            </p>
            {productCount > 0 && (
              <span className="font-body text-[10px] text-dervora-dark/50">
                Dipakai di {productCount} produk
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Function */}
      <td className="hidden sm:table-cell px-6 py-4 font-body text-sm text-dervora-dark/70">
        <p className="line-clamp-2 max-w-md">
          {ingredient.function || '—'}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(ingredient)}
            className="p-2 rounded-lg hover:bg-dervora-primary/10 text-dervora-primary transition-colors"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(ingredient)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};