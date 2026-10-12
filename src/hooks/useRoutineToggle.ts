import { useMemo } from 'react';
import { useRoutineStore } from '../store/routineStore';
import { MORNING_SLOTS, NIGHT_SLOTS } from '../data/routineSlots';
import type { Product } from '../lib/api';

interface RoutineStatus {
  isInRoutine: boolean;
  isInMorning: boolean;
  isInNight: boolean;
  slotId: string | null;
}

/**
 * Hook untuk cek apakah produk sudah ada di routine.
 * Return status + slot ID.
 */
export function useRoutineToggle(product: Product): RoutineStatus {
  const { morning, night } = useRoutineStore();

  return useMemo(() => {
    // Cari slot yang cocok dengan kategori produk
    const matchingMorningSlot = MORNING_SLOTS.find(
      (slot) => slot.category.toLowerCase() === product.category?.name.toLowerCase()
    );
    const matchingNightSlot = NIGHT_SLOTS.find(
      (slot) => slot.category.toLowerCase() === product.category?.name.toLowerCase()
    );

    const isInMorning = matchingMorningSlot
      ? morning[matchingMorningSlot.id]?.id === product.id
      : false;
    const isInNight = matchingNightSlot
      ? night[matchingNightSlot.id]?.id === product.id
      : false;

    // Cek apakah produk ada di slot manapun (by ID)
    const isInRoutine = Object.values(morning).some((p) => p?.id === product.id) ||
                        Object.values(night).some((p) => p?.id === product.id);

    // Slot ID default (untuk kategori ini)
    const slotId = matchingMorningSlot?.id || matchingNightSlot?.id || null;

    return {
      isInRoutine,
      isInMorning,
      isInNight,
      slotId,
    };
  }, [morning, night, product.id, product.category?.name]);
}

/**
 * Cek apakah produk dengan kategori sama sudah ada di slot tertentu.
 */
export function useIsSlotOccupied(category: string, timeOfDay: 'morning' | 'night') {
  const { morning, night } = useRoutineStore();
  const slots = timeOfDay === 'morning' ? MORNING_SLOTS : NIGHT_SLOTS;

  return useMemo(() => {
    const slot = slots.find(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
    if (!slot) return { occupied: false, product: null, slotId: null };

    const routine = timeOfDay === 'morning' ? morning : night;
    const product = routine[slot.id];

    return {
      occupied: !!product,
      product: product || null,
      slotId: slot.id,
    };
  }, [morning, night, category, timeOfDay]);
}