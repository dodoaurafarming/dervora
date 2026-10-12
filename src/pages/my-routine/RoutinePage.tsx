import React, { useState } from 'react';
import { Sun, Moon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRoutineStore } from '../../store/routineStore';
import { MORNING_SLOTS, NIGHT_SLOTS, type RoutineSlot } from '../../data/routineSlots';
import { RoutineCard } from '../../components/routine/RoutineCard';
import { EmptySlot } from '../../components/routine/EmptySlot';
import { ProductPickerModal } from '../../components/routine/ProductPickerModal';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { FadeIn } from '../../components/ui/FadeIn';
import type { Product } from '../../lib/api';

type TimeOfDay = 'morning' | 'night';

export const RoutinePage: React.FC = () => {
  const { morning, night, addProduct, removeProduct, clearRoutine } = useRoutineStore();

  // Modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<RoutineSlot | null>(null);
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<TimeOfDay>('morning');

  // Confirm clear
  const [confirmClear, setConfirmClear] = useState(false);

  const handleAddClick = (slot: RoutineSlot, timeOfDay: TimeOfDay) => {
    setActiveSlot(slot);
    setActiveTimeOfDay(timeOfDay);
    setPickerOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    if (!activeSlot) return;
    addProduct(activeSlot.id, product, activeTimeOfDay);
    toast.success(`${product.name} ditambahkan ke ${activeTimeOfDay === 'morning' ? 'Pagi' : 'Malam'}!`);
  };

  const handleRemove = (slotId: string, timeOfDay: TimeOfDay, productName: string) => {
    removeProduct(slotId, timeOfDay);
    toast.success(`${productName} dihapus dari rutinitas.`);
  };

  const handleClearRoutine = () => {
    clearRoutine();
    setConfirmClear(false);
    toast.success('Rutinitas direset.');
  };

  // Calculate total products
  const totalMorning = Object.values(morning).filter(Boolean).length;
  const totalNight = Object.values(night).filter(Boolean).length;

  const renderSlot = (slot: RoutineSlot, timeOfDay: TimeOfDay) => {
    const routine = timeOfDay === 'morning' ? morning : night;
    const product = routine[slot.id];

    if (product) {
      return (
        <RoutineCard
          key={slot.id}
          product={product}
          onRemove={() => handleRemove(slot.id, timeOfDay, product.name)}
        />
      );
    }

    return (
      <EmptySlot
        key={slot.id}
        slotName={slot.name}
        category={slot.category}
        required={slot.required}
        onClick={() => handleAddClick(slot, timeOfDay)}
      />
    );
  };

  return (
    <section className="w-full bg-dervora-cream pt-6 md:pt-8 pb-12 md:pb-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="w-12 h-[2px] bg-gradient-to-r from-dervora-primary to-dervora-primary/20 mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-dervora-primary leading-tight">
            My Skincare Routine ♡
          </h1>
          <p className="font-heading italic text-base md:text-lg text-dervora-dark/70 mt-3 max-w-2xl">
            Bangun rutinitas skincare harianmu, pagi dan malam.
          </p>
        </header>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <p className="font-body text-sm text-dervora-dark/60">
            {totalMorning + totalNight > 0
              ? `${totalMorning} produk pagi • ${totalNight} produk malam`
              : 'Belum ada produk di rutinitasmu'}
          </p>
          {(totalMorning > 0 || totalNight > 0) && (
            <button
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-dervora-beige text-red-500 font-body text-sm hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <Trash2 size={14} />
              Reset Rutinitas
            </button>
          )}
        </div>

        {/* Grid: Morning + Night */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Morning */}
          <FadeIn>
            <div className="bg-white/60 rounded-3xl border border-dervora-beige p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dervora-beige">
                <div className="w-10 h-10 rounded-full bg-dervora-blush/40 flex items-center justify-center">
                  <Sun size={20} className="text-dervora-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-dervora-primary">
                    Pagi
                  </h2>
                  <p className="font-body text-xs text-dervora-dark/60">
                    {totalMorning} dari {MORNING_SLOTS.length} slot terisi
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {MORNING_SLOTS.map((slot) => renderSlot(slot, 'morning'))}
              </div>
            </div>
          </FadeIn>

          {/* Night */}
          <FadeIn delay={0.1}>
            <div className="bg-white/60 rounded-3xl border border-dervora-beige p-5 md:p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dervora-beige">
                <div className="w-10 h-10 rounded-full bg-dervora-primary/10 flex items-center justify-center">
                  <Moon size={20} className="text-dervora-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-dervora-primary">
                    Malam
                  </h2>
                  <p className="font-body text-xs text-dervora-dark/60">
                    {totalNight} dari {NIGHT_SLOTS.length} slot terisi
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {NIGHT_SLOTS.map((slot) => renderSlot(slot, 'night'))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Tips */}
        <FadeIn delay={0.2}>
          <div className="mt-8 p-5 md:p-6 bg-dervora-primary/5 rounded-2xl border border-dashed border-dervora-primary/20">
            <p className="font-heading italic text-sm md:text-base text-dervora-dark/80 leading-relaxed">
              💡 <span className="font-semibold">Tips:</span> Rutinitas pagi fokus pada perlindungan (sunscreen), sementara malam fokus pada perbaikan (serum & treatment).
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Product Picker Modal */}
      <ProductPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectProduct}
        categoryFilter={activeSlot?.category}
        slotName={activeSlot?.name}
      />

      {/* Confirm Clear Routine */}
      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearRoutine}
        variant="danger"
        title="Reset Rutinitas?"
        message="Yakin ingin menghapus semua produk dari rutinitasmu? Tindakan ini tidak bisa dibatalkan."
        confirmText="Ya, Reset"
      />
    </section>
  );
};