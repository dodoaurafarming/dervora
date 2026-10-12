import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../lib/api';

interface RoutineState {
  morning: Record<string, Product | null>;
  night: Record<string, Product | null>;
  addProduct: (slotId: string, product: Product, timeOfDay: 'morning' | 'night') => void;
  removeProduct: (slotId: string, timeOfDay: 'morning' | 'night') => void;
  clearRoutine: () => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      morning: {},
      night: {},

      addProduct: (slotId, product, timeOfDay) =>
        set((state) => ({
          [timeOfDay]: {
            ...state[timeOfDay],
            [slotId]: product,
          },
        })),

      removeProduct: (slotId, timeOfDay) =>
        set((state) => ({
          [timeOfDay]: {
            ...state[timeOfDay],
            [slotId]: null,
          },
        })),

      clearRoutine: () => set({ morning: {}, night: {} }),
    }),
    {
      name: 'dervora_routine',
    }
  )
);