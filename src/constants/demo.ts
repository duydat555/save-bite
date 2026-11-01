// Fixture "today" used in Figma (SB-051/056): Thứ Hai, 19/10. Kept literal so screens match the design.
export const DEMO_DATE_LONG = 'Thứ Hai, 19/10';
export const DEMO_DATE_SHORT = '19/10';

// SB-051 shows a second, already-closed slot for the same day (static fixture).
export const CLOSED_SLOT = {
  title: '15:00 – 16:00 · Chiều nay (Đã đóng)',
  hint: 'Đã qua khung giờ nhận · Không thể chọn',
} as const;
