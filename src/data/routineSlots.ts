export interface RoutineSlot {
  id: string;
  name: string;
  category: string; // Kategori produk yang cocok
  required: boolean;
}

export const MORNING_SLOTS: RoutineSlot[] = [
  { id: 'morning-cleanser', name: 'Cleanser', category: 'Cleanser', required: true },
  { id: 'morning-toner', name: 'Toner', category: 'Toner', required: false },
  { id: 'morning-serum', name: 'Serum', category: 'Serum', required: false },
  { id: 'morning-moisturizer', name: 'Moisturizer', category: 'Moisturizer', required: true },
  { id: 'morning-sunscreen', name: 'Sunscreen', category: 'Sunscreen', required: true },
];

export const NIGHT_SLOTS: RoutineSlot[] = [
  { id: 'night-cleanser', name: 'Cleanser', category: 'Cleanser', required: true },
  { id: 'night-toner', name: 'Toner', category: 'Toner', required: false },
  { id: 'night-serum', name: 'Serum', category: 'Serum', required: false },
  { id: 'night-moisturizer', name: 'Moisturizer', category: 'Moisturizer', required: true },
];

export type TimeOfDay = 'morning' | 'night';