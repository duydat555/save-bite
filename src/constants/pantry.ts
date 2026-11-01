import type { SvgName } from '@/design-system/icons/svg-data';
import type { PantryCategory, PantryDateKind, PantryFreshness, PantryStorage } from '@/types';

// Figma "today" (SB-075 statuses are computed against it: 21/10 and 20/10 = Sắp hạn, 26/10 = Còn hạn, 18/10 = Quá hạn).
export const PANTRY_TODAY = '2026-10-19';

export const categoryMeta: Record<PantryCategory, { label: string; icon: SvgName }> = {
  bakery: { label: 'Bánh & ngũ cốc', icon: 'bread' },
  milkEggs: { label: 'Sữa & trứng', icon: 'milk-carton' },
  produce: { label: 'Rau & củ', icon: 'carrot' },
  fruit: { label: 'Trái cây', icon: 'orange-slice' },
  prepared: { label: 'Đồ chế biến', icon: 'bowl-food' },
  meatFish: { label: 'Thịt & cá', icon: 'fish' },
  spices: { label: 'Gia vị & hạt', icon: 'plant' },
  other: { label: 'Khác', icon: 'shopping-bag' },
};
export const categoryOrder: PantryCategory[] = [
  'bakery',
  'milkEggs',
  'produce',
  'fruit',
  'prepared',
  'meatFish',
  'spices',
  'other',
];

export const storageLabel: Record<PantryStorage, string> = {
  cold: 'Ngăn mát',
  dry: 'Kệ khô',
  frozen: 'Ngăn đông',
};

export const dateKindLabel: Record<PantryDateKind, string> = {
  'use-by': 'Hạn sử dụng (Use by)',
  'best-before': 'Nên dùng trước (Best before)',
};

export const freshnessLabel: Record<PantryFreshness, string> = {
  good: 'Còn hạn',
  soon: 'Sắp hạn',
  overdue: 'Quá hạn',
};
