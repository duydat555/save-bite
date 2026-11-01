import { create } from 'zustand';

// Demo switches (Figma DemoHotspots on SB-055: "057 offline", "058 stock"). Armed from the dev hub, consumed once by
// the next "Xác nhận giữ chỗ" so the failure screens can be shown on demand.
type Flags = {
  failNext: null | 'offline' | 'stock';
  arm: (f: 'offline' | 'stock' | null) => void;
  /** Hides the completed-order fixtures so SB-073 (empty order history) can be shown. */
  historyCleared: boolean;
  setHistoryCleared: (v: boolean) => void;
  /** Hides the notifications so SB-096 (empty state) can be shown. */
  notificationsCleared: boolean;
  setNotificationsCleared: (v: boolean) => void;
};

export const useDevFlags = create<Flags>()((set) => ({
  failNext: null,
  arm: (f) => set({ failNext: f }),
  historyCleared: false,
  setHistoryCleared: (v) => set({ historyCleared: v }),
  notificationsCleared: false,
  setNotificationsCleared: (v) => set({ notificationsCleared: v }),
}));
