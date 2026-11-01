import { create } from 'zustand';

import type { PantryCategory, PantryDateKind, PantryStorage } from '@/types';

// In-memory draft shared by the add form (SB-077), its sheets (SB-078/079) and the review step (SB-080).
export type PantryDraft = {
  name: string;
  category: PantryCategory;
  storage: PantryStorage;
  quantity: string;
  dateKind: PantryDateKind;
  date: string; // dd/mm/yyyy as typed
};

// Prefilled like the Figma frame (SB-077).
export const emptyDraft: PantryDraft = {
  name: 'Sữa tươi mới mua',
  category: 'milkEggs',
  storage: 'cold',
  quantity: '1 hộp',
  dateKind: 'use-by',
  date: '21/10/2026',
};

type DraftState = { draft: PantryDraft; set: (p: Partial<PantryDraft>) => void; reset: () => void };

export const usePantryDraft = create<DraftState>()((set) => ({
  draft: emptyDraft,
  set: (p) => set((s) => ({ draft: { ...s.draft, ...p } })),
  reset: () => set({ draft: emptyDraft }),
}));
