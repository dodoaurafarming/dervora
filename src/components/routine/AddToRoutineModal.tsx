import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertTriangle } from 'lucide-react';
import { Modal } from '../admin/Modal';
import { Button } from '../ui/Button';
import { useRoutineStore } from '../../store/routineStore';
import { MORNING_SLOTS, NIGHT_SLOTS } from '../../data/routineSlots';
import type { Product } from '../../lib/api';

interface AddToRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

export const AddToRoutineModal: React.FC<AddToRoutineModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { morning, night, addProduct } = useRoutineStore();
  const [selectedTime, setSelectedTime] = useState<'morning' | 'night' | null>(null);

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedTime(null);
    }
  }, [isOpen]);

  if (!product) return null;

  const category = product.category?.name || '';
  const morningSlot = MORNING_SLOTS.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );
  const nightSlot = NIGHT_SLOTS.find(
    (s) => s.category.toLowerCase() === category.toLowerCase()
  );

  const currentMorningProduct = morningSlot ? morning[morningSlot.id] : null;
  const currentNightProduct = nightSlot ? night[nightSlot.id] : null;

  const hasMorningConflict = !!currentMorningProduct && currentMorningProduct.id !== product.id;
  const hasNightConflict = !!currentNightProduct && currentNightProduct.id !== product.id;

  const handleConfirm = () => {
    if (!selectedTime) return;

    const slot = selectedTime === 'morning' ? morningSlot : nightSlot;
    if (!slot) return;

    // Add product ke slot (replace otomatis karena store pakai key-based)
    addProduct(slot.id, product, selectedTime);
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah ke Rutinitas"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={!selectedTime}
          >
            Konfirmasi
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Product Preview */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-dervora-cream/40 border border-dervora-beige">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-dervora-beige/30 flex-shrink-0">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-dervora-primary/30">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[10px] text-dervora-dark/50 uppercase tracking-wider mb-0.5">
              {category}
            </p>
            <p className="font-body text-sm font-medium text-dervora-dark line-clamp-2">
              {product.name}
            </p>
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <p className="font-body text-sm font-medium text-dervora-dark mb-3">
            Kapan kamu mau pakai produk ini?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Morning */}
            <button
              onClick={() => setSelectedTime('morning')}
              disabled={!morningSlot}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedTime === 'morning'
                  ? 'border-dervora-primary bg-dervora-primary/5'
                  : 'border-dervora-beige bg-white hover:border-dervora-primary/40'
              } ${!morningSlot ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Sun
                size={28}
                className={`mb-2 ${
                  selectedTime === 'morning'
                    ? 'text-dervora-primary'
                    : 'text-dervora-dark/60'
                }`}
              />
              <p className="font-heading text-lg font-bold text-dervora-primary">
                Pagi
              </p>
              <p className="font-body text-xs text-dervora-dark/60 mt-1">
                {morningSlot ? `Slot ${morningSlot.name}` : 'Tidak tersedia'}
              </p>
            </button>

            {/* Night */}
            <button
              onClick={() => setSelectedTime('night')}
              disabled={!nightSlot}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedTime === 'night'
                  ? 'border-dervora-primary bg-dervora-primary/5'
                  : 'border-dervora-beige bg-white hover:border-dervora-primary/40'
              } ${!nightSlot ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Moon
                size={28}
                className={`mb-2 ${
                  selectedTime === 'night'
                    ? 'text-dervora-primary'
                    : 'text-dervora-dark/60'
                }`}
              />
              <p className="font-heading text-lg font-bold text-dervora-primary">
                Malam
              </p>
              <p className="font-body text-xs text-dervora-dark/60 mt-1">
                {nightSlot ? `Slot ${nightSlot.name}` : 'Tidak tersedia'}
              </p>
            </button>
          </div>
        </div>

        {/* Conflict Warning */}
        {selectedTime === 'morning' && hasMorningConflict && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="font-body text-xs text-amber-700 leading-relaxed">
              Slot <strong>Pagi - {morningSlot?.name}</strong> sudah terisi oleh{' '}
              <strong>{currentMorningProduct?.name}</strong>. Produk akan digantikan.
            </p>
          </div>
        )}

        {selectedTime === 'night' && hasNightConflict && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="font-body text-xs text-amber-700 leading-relaxed">
              Slot <strong>Malam - {nightSlot?.name}</strong> sudah terisi oleh{' '}
              <strong>{currentNightProduct?.name}</strong>. Produk akan digantikan.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};