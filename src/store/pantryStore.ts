import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { pantryHistorySeed } from '@/data/mock/account';
import { pantrySeed } from '@/data/mock/pantry';
import type { PantryEvent, PantryItem } from '@/types';

type PantryState = {
  items: PantryItem[];
  history: PantryEvent[];
  add: (item: Omit<PantryItem, 'id'>) => string;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<PantryItem, 'id'>>) => void;
  /** Prepends a SB-089 history row (timestamp = Figma demo day + the real clock). */
  log: (item: Pick<PantryItem, 'name' | 'icon'>, status: string, detail: string) => void;
  /** SB-090 "Xóa dữ liệu trên máy". */
  clearAll: () => void;
  reset: () => void;
};

const stamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `19/10 · ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// First launch starts with the 7 rows shown in Figma SB-075; the dev hub can empty or reset it (SB-076).
export const usePantryStore = create<PantryState>()(
  persist(
    (set) => ({
      items: pantrySeed,
      history: pantryHistorySeed,
      add: (item) => {
        const id = `p-${Date.now()}`;
        set((s) => ({
          items: [{ ...item, id }, ...s.items],
          history: [
            {
              id: `h-${id}`,
              name: item.name,
              icon: item.icon,
              status: 'Đã thêm',
              detail: `${item.quantity}, ${
                { cold: 'Ngăn mát', dry: 'Kệ khô', frozen: 'Ngăn đông' }[item.storage]
              }`,
              when: stamp(),
            },
            ...s.history,
          ],
        }));
        return id;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      update: (id, patch) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      log: (item, status, detail) =>
        set((s) => ({
          history: [
            {
              id: `h-${Date.now()}`,
              name: item.name,
              icon: item.icon,
              status,
              detail,
              when: stamp(),
            },
            ...s.history,
          ],
        })),
      clearAll: () => set({ items: [], history: [] }),
      reset: () => set({ items: pantrySeed, history: pantryHistorySeed }),
    }),
    { name: 'savebite.pantry', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
