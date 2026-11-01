import { create } from 'zustand';

// Search filters (SB-023…027). Initial values are the ones drawn in Figma SB-023 ("Tối đa 30.000đ", "Hôm nay · 17:00–18:00",
// "Món cụ thể"). In-memory only: filters reset when the app restarts.
export type Budget = 30000 | 50000 | 'custom' | null; // custom = ESTIMATE: capped at CUSTOM_CAP (no editor in Figma)
export const CUSTOM_CAP = 40000;
export type Slot = { start: string; end: string } | null;
export type Kind = 'specific' | 'surprise';
export type Sort = 'distance' | 'earliest' | 'price' | 'stock';

export const DIETARY_OPTIONS = [
  'Ăn chay / Thanh đạm',
  'Không sữa động vật (Dairy-free)',
  'Ít ngọt / Nguyên cám',
] as const;

type Filters = {
  budget: Budget;
  slot: Slot;
  kinds: Kind[];
  dietary: string[];
  sort: Sort;
  set: (p: Partial<Omit<Filters, 'set' | 'reset'>>) => void;
  reset: () => void;
};

const initial = {
  budget: 30000 as Budget,
  slot: { start: '17:00', end: '18:00' } as Slot,
  kinds: ['specific'] as Kind[],
  dietary: [] as string[],
  sort: 'distance' as Sort,
};

export const useFilters = create<Filters>()((set) => ({
  ...initial,
  set: (p) => set(p),
  // "Đặt lại" clears every criterion (no cap, no slot, nothing selected).
  reset: () => set({ budget: null, slot: null, kinds: [], dietary: [], sort: 'distance' }),
}));

export const budgetLabel = (b: Budget) =>
  b === 30000
    ? 'Tối đa 30.000đ'
    : b === 50000
      ? 'Tối đa 50.000đ'
      : b === 'custom'
        ? 'Tùy chỉnh'
        : 'Không giới hạn';
