import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// SB-033 "Đã lưu": starts with the two offers shown in Figma; the heart on SB-034/SB-047 toggles membership.
type SavedState = { ids: string[]; toggle: (id: string) => void };

export const useSaved = create<SavedState>()(
  persist(
    (set) => ({
      ids: ['offer-banh-mi-men-tu-nhien', 'offer-banh-sung-bo-bo-phap'],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: 'savebite.saved', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
