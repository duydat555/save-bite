import { create } from 'zustand';

// Transient UI hand-offs between tabs (not persisted).
type UiState = {
  /** SB-061: Khám phá's active-order strip asks the Orders tab to show "Đang chờ nhận · timeline" once. */
  ordersPending: boolean;
  setOrdersPending: (v: boolean) => void;
  /** SB-054 sheet → SB-053: incremented when the user confirms, which starts the processing state. */
  confirmTick: number;
  requestConfirm: () => void;
};

export const useUi = create<UiState>()((set) => ({
  ordersPending: false,
  setOrdersPending: (ordersPending) => set({ ordersPending }),
  confirmTick: 0,
  requestConfirm: () => set((s) => ({ confirmTick: s.confirmTick + 1 })),
}));
