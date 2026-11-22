import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertTriangle, Check } from 'lucide-react';
import { Modal } from '../admin/Modal';
import { Button } from '../ui/Button';
import {
  useRoutineStore,
  type RoutineSlotTarget,
} from '../../store/routineStore';
import { MORNING_SLOTS, NIGHT_SLOTS } from '../../data/routineSlots';
import type { Product } from '../../lib/api';

interface AddToRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess?: () => void;
}

interface SelectedTimes {
  morning: boolean;
  night: boolean;
}

export const AddToRoutineModal: React.FC<AddToRoutineModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { morning, night, addProductToSlots } = useRoutineStore();
  const [selectedTimes, setSelectedTimes] = useState<SelectedTimes>({
    morning: false,
    night: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset pilihan & status submit saat modal dibuka atau produk berganti
  useEffect(() => {
    if (isOpen) {
      setSelectedTimes({ morning: false, night: false });
      setIsSubmitting(false);
    }
  }, [isOpen, product?.id]);

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

  const isAlreadyInMorning = currentMorningProduct?.id === product.id;
  const isAlreadyInNight = currentNightProduct?.id === product.id;

  const hasMorningConflict = !!currentMorningProduct && !isAlreadyInMorning;
  const hasNightConflict = !!currentNightProduct && !isAlreadyInNight;

  const canSelectBoth = !!morningSlot && !!nightSlot;
  const isBothSelected = selectedTimes.morning && selectedTimes.night;
  const hasSelection = selectedTimes.morning || selectedTimes.night;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const toggleTime = (time: 'morning' | 'night') => {
    if (isSubmitting) return;
    if (time === 'morning' && !morningSlot) return;
    if (time === 'night' && !nightSlot) return;

    setSelectedTimes((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  };

  const handleToggleBoth = () => {
    if (!canSelectBoth || isSubmitting) return;
    const nextValue = !isBothSelected;
    setSelectedTimes({
      morning: nextValue,
      night: nextValue,
    });
  };

  const handleConfirm = async () => {
    if (!hasSelection || isSubmitting) return;

    const targets: RoutineSlotTarget[] = [];

    if (selectedTimes.morning && morningSlot) {
      targets.push({ slotId: morningSlot.id, timeOfDay: 'morning' });
    }
    if (selectedTimes.night && nightSlot) {
      targets.push({ slotId: nightSlot.id, timeOfDay: 'night' });
    }

    if (targets.length === 0) return;

    setIsSubmitting(true);
    try {
      const ok = await addProductToSlots(product, targets);
      if (ok) {
        onSuccess?.();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmLabel = isBothSelected
    ? 'Tambah ke Pagi & Malam'
    : selectedTimes.morning
      ? 'Tambah ke Pagi'
      : selectedTimes.night
        ? 'Tambah ke Malam'
        : 'Konfirmasi';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah ke Rutinitas"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={!hasSelection || isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : confirmLabel}
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
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <p className="font-body text-sm font-medium text-dervora-dark">
                Kapan kamu mau pakai produk ini?
              </p>
              {canSelectBoth && (
                <p className="font-body text-xs text-dervora-dark/50 mt-0.5">
                  Bisa pilih salah satu atau keduanya sekaligus
                </p>
              )}
            </div>

            {canSelectBoth && (
              <button
                type="button"
                onClick={handleToggleBoth}
                disabled={isSubmitting}
                className="font-body text-xs font-semibold text-dervora-primary hover:underline flex-shrink-0 disabled:opacity-50"
              >
                {isBothSelected ? 'Batal semua' : 'Pilih keduanya'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Morning */}
            <button
              type="button"
              aria-pressed={selectedTimes.morning}
              onClick={() => toggleTime('morning')}
              disabled={!morningSlot || isSubmitting}
              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                selectedTimes.morning
                  ? 'border-dervora-primary bg-dervora-primary/5'
                  : 'border-dervora-beige bg-white hover:border-dervora-primary/40'
              } ${!morningSlot || isSubmitting ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {morningSlot && (
                <span
                  className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    selectedTimes.morning
                      ? 'bg-dervora-primary border-dervora-primary text-white'
                      : 'border-dervora-beige bg-white'
                  }`}
                >
                  {selectedTimes.morning && <Check size={12} strokeWidth={3} />}
                </span>
              )}

              <Sun
                size={28}
                className={`mb-2 ${
                  selectedTimes.morning
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
              {isAlreadyInMorning && (
                <p className="font-body text-[11px] font-medium text-dervora-primary mt-1.5">
                  Sudah ada di slot ini
                </p>
              )}
            </button>

            {/* Night */}
            <button
              type="button"
              aria-pressed={selectedTimes.night}
              onClick={() => toggleTime('night')}
              disabled={!nightSlot || isSubmitting}
              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                selectedTimes.night
                  ? 'border-dervora-primary bg-dervora-primary/5'
                  : 'border-dervora-beige bg-white hover:border-dervora-primary/40'
              } ${!nightSlot || isSubmitting ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {nightSlot && (
                <span
                  className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    selectedTimes.night
                      ? 'bg-dervora-primary border-dervora-primary text-white'
                      : 'border-dervora-beige bg-white'
                  }`}
                >
                  {selectedTimes.night && <Check size={12} strokeWidth={3} />}
                </span>
              )}

              <Moon
                size={28}
                className={`mb-2 ${
                  selectedTimes.night
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
              {isAlreadyInNight && (
                <p className="font-body text-[11px] font-medium text-dervora-primary mt-1.5">
                  Sudah ada di slot ini
                </p>
              )}
            </button>
          </div>
        </div>

        {/* Conflict Warnings */}
        {((selectedTimes.morning && hasMorningConflict) ||
          (selectedTimes.night && hasNightConflict)) && (
          <div className="space-y-2">
            {selectedTimes.morning && hasMorningConflict && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle
                  size={16}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />
                <p className="font-body text-xs text-amber-700 leading-relaxed">
                  Slot <strong>Pagi - {morningSlot?.name}</strong> sudah terisi oleh{' '}
                  <strong>{currentMorningProduct?.name}</strong>. Produk akan digantikan.
                </p>
              </div>
            )}

            {selectedTimes.night && hasNightConflict && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle
                  size={16}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />
                <p className="font-body text-xs text-amber-700 leading-relaxed">
                  Slot <strong>Malam - {nightSlot?.name}</strong> sudah terisi oleh{' '}
                  <strong>{currentNightProduct?.name}</strong>. Produk akan digantikan.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};