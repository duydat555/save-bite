import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { savedAreasSeed } from '@/data/mock/account';
import type { SavedArea } from '@/types';

// SB-097 toggles (Figma initial state: all on except "Gợi ý dùng món trong tủ").
export type NotificationPrefs = {
  beforeSlot: boolean;
  closingSoon: boolean;
  expirySoon: boolean;
  morning: boolean;
  suggestions: boolean;
};

type AccountState = {
  areas: SavedArea[];
  campus: string; // SB-092 "Khu học xá mặc định"
  prefs: NotificationPrefs;
  /** SB-074 is shown once, the first time the Tủ thực phẩm tab opens. */
  pantryIntroSeen: boolean;
  setPantryIntroSeen: (v: boolean) => void;
  addArea: (a: Omit<SavedArea, 'id'>) => void;
  setCampus: (c: string) => void;
  setPref: (k: keyof NotificationPrefs, v: boolean) => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      areas: savedAreasSeed,
      campus: 'ĐH Đà Nẵng',
      prefs: {
        beforeSlot: true,
        closingSoon: true,
        expirySoon: true,
        morning: true,
        suggestions: false,
      },
      pantryIntroSeen: false,
      setPantryIntroSeen: (pantryIntroSeen) => set({ pantryIntroSeen }),
      addArea: (a) => set((s) => ({ areas: [...s.areas, { ...a, id: `a-${Date.now()}` }] })),
      setCampus: (campus) => set({ campus }),
      setPref: (k, v) => set((s) => ({ prefs: { ...s.prefs, [k]: v } })),
    }),
    { name: 'savebite.account', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
