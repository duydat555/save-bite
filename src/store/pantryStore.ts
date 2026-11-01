import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { pantrySeed } from '@/data/mock/pantry';
import type { PantryItem } from '@/types';

type PantryState = {
  items: PantryItem[];
  add: (item: Omit<PantryItem, 'id'>) => string;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<PantryItem, 'id'>>) => void;
  reset: () => void;
};

// First launch starts with the 7 rows shown in Figma SB-075; the dev hub can empty or reset it (SB-076).
export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      items: pantrySeed,
      add: (item) => {
        const id = `p-${Date.now()}`;
        set((s) => ({ items: [{ ...item, id }, ...s.items] }));
        return id;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      reset: () => set({ items: pantrySeed }),
    }),
    { name: 'savebite.pantry', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
