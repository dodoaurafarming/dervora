import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../lib/api';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';
import { MORNING_SLOTS, NIGHT_SLOTS, type RoutineSlot } from '../data/routineSlots';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

interface RoutineState {
  morning: Record<string, Product | null>;
  night: Record<string, Product | null>;
  isLoading: boolean;
  
  fetchRoutine: () => Promise<void>;
  addProduct: (slotId: string, product: Product, timeOfDay: 'morning' | 'night') => Promise<void>;
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
    (set) => ({
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
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (res.ok) {
            const result = await res.json();
            const routines = result.data?.routines || [];

            const newMorning: Record<string, Product | null> = {};
            const newNight: Record<string, Product | null> = {};

            // Mapping data database kembali ke format Record frontend
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

      // 2. Tambah produk (Simpan ke DB + Update State Lokal)
      addProduct: async (slotId, product, timeOfDay) => {
        const user = auth.currentUser;
        if (!user) {
          toast.error('Silakan login terlebih dahulu untuk menyimpan rutinitas.');
          return;
        }

        // Cari step berdasarkan urutan slot di data
        const slots = timeOfDay === 'morning' ? MORNING_SLOTS : NIGHT_SLOTS;
        const step = slots.findIndex((s: RoutineSlot) => s.id === slotId) + 1;

        try {
          const token = await getAuthToken();
          const res = await fetch(`${BACKEND_URL}/api/routine`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
              productId: product.id, 
              slotId, 
              timeOfDay: timeOfDay === 'morning' ? 'PAGI' : 'MALAM', 
              step 
            }),
          });
          
          if (res.ok) {
            // Optimistic update: update state lokal agar UI langsung responsif
            set((state) => ({
              [timeOfDay]: {
                ...state[timeOfDay],
                [slotId]: product,
              }
            }));
            toast.success(`${product.name} ditambahkan ke ${timeOfDay === 'morning' ? 'Pagi' : 'Malam'}! ✨`);
          } else {
            throw new Error('Gagal menyimpan');
          }
        } catch (error) {
          console.error(error);
          toast.error('Gagal menambahkan ke rutinitas. Coba lagi.');
        }
      },

      // 3. Hapus produk (Hapus di DB + Update State Lokal)
      removeProduct: async (slotId, timeOfDay) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
          const token = await getAuthToken();
          const res = await fetch(`${BACKEND_URL}/api/routine/${slotId}?timeOfDay=${timeOfDay === 'morning' ? 'PAGI' : 'MALAM'}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            set((state) => ({
              [timeOfDay]: {
                ...state[timeOfDay],
                [slotId]: null,
              }
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

      // 4. Reset semua (Hapus di DB + Reset State) -> PERBAIKAN BUG 3 & 4
      clearRoutine: async () => {
        const user = auth.currentUser;
        if (!user) {
          set({ morning: {}, night: {} });
          return;
        }

        try {
          const token = await getAuthToken();
          
          // Memanggil endpoint baru di backend untuk menghapus semua data user ini
          const res = await fetch(`${BACKEND_URL}/api/routine/clear`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Reset state lokal setelah backend berhasil menghapus
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
      name: 'dervora_routine', // Tetap simpan di local storage sebagai fallback offline
    }
  )
);