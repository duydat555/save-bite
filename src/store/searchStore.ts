import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Recent searches. Defaults are the three entries shown in Figma SB-019.
const DEFAULTS = ['Bánh mì men tự nhiên', 'Cơm gà áp chảo', 'Túi bánh bất ngờ'];

type SearchState = {
  recent: string[];
  add: (q: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: DEFAULTS,
      add: (q) =>
        set((s) => {
          const t = q.trim();
          if (!t) return s;
          return { recent: [t, ...s.recent.filter((x) => x !== t)].slice(0, 5) };
        }),
      clear: () => set({ recent: [] }),
    }),
    { name: 'savebite.search', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
