import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../lib/api';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';
import { MORNING_SLOTS, NIGHT_SLOTS, type RoutineSlot } from '../data/routineSlots';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export interface RoutineSlotTarget {
  slotId: string;
  timeOfDay: 'morning' | 'night';
}

interface RoutineState {
  morning: Record<string, Product | null>;
  night: Record<string, Product | null>;
  isLoading: boolean;

  fetchRoutine: () => Promise<void>;
  addProduct: (slotId: string, product: Product, timeOfDay: 'morning' | 'night') => Promise<boolean>;
  addProductToSlots: (product: Product, targets: RoutineSlotTarget[]) => Promise<boolean>;
  removeProduct: (slotId: string, timeOfDay: 'morning' | 'night') => Promise<void>;
  clearRoutine: () => Promise<void>;
}

const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      morning: {},
      night: {},
      isLoading: false,

      // 1. Ambil data dari database saat halaman dimuat
      fetchRoutine: async () => {
        const user = auth.currentUser;
        if (!user) return;

        set({ isLoading: true });
        try {
          const token = await getAuthToken();
          const res = await fetch(`${BACKEND_URL}/api/routine`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const result = await res.json();
            const routines = result.data?.routines || [];

            const newMorning: Record<string, Product | null> = {};
            const newNight: Record<string, Product | null> = {};

            routines.forEach((r: any) => {
              const timeKey = r.timeOfDay === 'PAGI' ? 'morning' : 'night';
              if (r.slotId && r.product) {
                if (timeKey === 'morning') {
                  newMorning[r.slotId] = r.product;
                } else {
                  newNight[r.slotId] = r.product;
                }
              }
            });

            set({ morning: newMorning, night: newNight });
          }
        } catch (error) {
          console.error('Gagal mengambil data rutinitas:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // 2a. Tambah produk ke satu atau beberapa slot (Pagi / Malam / Keduanya)
      addProductToSlots: async (product, targets) => {
        if (targets.length === 0) return false;

        const user = auth.currentUser;
        if (!user) {
          toast.error('Silakan login terlebih dahulu untuk menyimpan rutinitas.');
          return false;
        }

        try {
          const token = await getAuthToken();
          const succeeded: RoutineSlotTarget[] = [];

          // Jalankan berurutan agar aman dari konflik transaksi database
          for (const target of targets) {
            const slots = target.timeOfDay === 'morning' ? MORNING_SLOTS : NIGHT_SLOTS;
            const step = slots.findIndex((s: RoutineSlot) => s.id === target.slotId) + 1;

            const res = await fetch(`${BACKEND_URL}/api/routine`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                productId: product.id,
                slotId: target.slotId,
                timeOfDay: target.timeOfDay === 'morning' ? 'PAGI' : 'MALAM',
                step,
              }),
            });

            if (res.ok) {
              succeeded.push(target);
            }
          }

          if (succeeded.length === 0) {
            throw new Error('Gagal menyimpan ke semua slot');
          }

          // Update state lokal sekaligus dalam 1 batch
          set((state) => {
            const nextMorning = { ...state.morning };
            const nextNight = { ...state.night };

            for (const item of succeeded) {
              if (item.timeOfDay === 'morning') {
                nextMorning[item.slotId] = product;
              } else {
                nextNight[item.slotId] = product;
              }
            }

            return { morning: nextMorning, night: nextNight };
          });

          const savedMorning = succeeded.some((t) => t.timeOfDay === 'morning');
          const savedNight = succeeded.some((t) => t.timeOfDay === 'night');
          const timeLabel =
            savedMorning && savedNight
              ? 'Pagi & Malam'
              : savedMorning
                ? 'Pagi'
                : 'Malam';

          if (succeeded.length === targets.length) {
            toast.success(`${product.name} ditambahkan ke ${timeLabel}! ✨`);
          } else {
            toast.success(`${product.name} baru tersimpan ke ${timeLabel}. Sebagian slot gagal disimpan.`);
          }

          return true;
        } catch (error) {
          console.error(error);
          toast.error('Gagal menambahkan ke rutinitas. Coba lagi.');
          return false;
        }
      },

      // 2b. Tetap kompatibel dengan pemanggil single-slot (mis. ProductPickerModal)
      addProduct: async (slotId, product, timeOfDay) => {
        return get().addProductToSlots(product, [{ slotId, timeOfDay }]);
      },

      // 3. Hapus produk (Hapus di DB + Update State Lokal)
      removeProduct: async (slotId, timeOfDay) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
          const token = await getAuthToken();
          const res = await fetch(
            `${BACKEND_URL}/api/routine/${slotId}?timeOfDay=${timeOfDay === 'morning' ? 'PAGI' : 'MALAM'}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.ok) {
            set((state) => ({
              [timeOfDay]: {
                ...state[timeOfDay],
                [slotId]: null,
              },
            }));
            toast.success('Produk dihapus dari rutinitas.');
          } else {
            throw new Error('Gagal menghapus');
          }
        } catch (error) {
          console.error(error);
          toast.error('Gagal menghapus dari rutinitas.');
        }
      },

      // 4. Reset semua (Hapus di DB + Reset State)
      clearRoutine: async () => {
        const user = auth.currentUser;
        if (!user) {
          set({ morning: {}, night: {} });
          return;
        }

        try {
          const token = await getAuthToken();
          const res = await fetch(`${BACKEND_URL}/api/routine/clear`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            set({ morning: {}, night: {} });
            toast.success('Semua rutinitas berhasil direset.');
          } else {
            throw new Error('Gagal mereset rutinitas');
          }
        } catch (error) {
          console.error(error);
          toast.error('Gagal mereset rutinitas. Coba lagi.');
        }
      },
    }),
    {
      name: 'dervora_routine',
    }
  )
);