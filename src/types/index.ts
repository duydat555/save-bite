// Draft models — see docs/05-DATA-MODEL.md. Extend per screen as Figma content is read.

export type OfferCategory = 'bakery' | 'meal' | 'produce' | 'surprise';

export type User = {
  id: string;
  email: string;
  displayName: string; // "Minh Anh"
  area: string; // "Đà Nẵng · Khu học xá"
};

export type Merchant = {
  id: string;
  name: string; // "Tiệm Bánh A"
  distanceM?: number; // 450 → "450m"; unknown for some merchants in Figma
  photo?: number; // storefront photo on the merchant page (SB-038)
  pickupPoint?: string; // "Điểm nhận A · ĐH Đà Nẵng · 450m" (SB-034 / SB-056); only known for Tiệm Bánh A
};

export type Offer = {
  id: string;
  merchantId: string;
  title: string;
  category: OfferCategory;
  priceVnd: number;
  remaining: number;
  pickupStart: string; // "17:00"
  pickupEnd: string; // "18:00"
  image: number; // local asset (require)
  listTitle?: string; // longer title used on the merchant page (e.g. "Túi bánh bất ngờ cuối ngày")
  unit?: string; // stock unit, default "phần" (surprise bags use "túi")
};

export type OfferWithMerchant = Offer & { merchant: Merchant };

export type Session = {
  user: User | null;
  isGuest: boolean;
  hasSeenOnboarding: boolean;
};

export type ReservationStatus =
  'awaiting_pickup' | 'ready' | 'closing_soon' | 'completed' | 'cancelled' | 'expired';

/** Persisted in AsyncStorage (JSON) — offer data is joined at read time, never stored (images are require()d). */
export type Reservation = {
  id: string;
  offerId: string;
  quantity: number;
  slotStart: string;
  slotEnd: string;
  status: ReservationStatus;
  ticketNo: string; // "SB-001" (header of the pickup pass)
  code: string; // "SB-A125"
  createdAt: string;
};

export type ReservationWithOffer = Reservation & { offer: OfferWithMerchant };

// ---- Pantry (Tủ thực phẩm) ----
export type PantryCategory =
  'bakery' | 'milkEggs' | 'produce' | 'fruit' | 'prepared' | 'meatFish' | 'spices' | 'other';

export type PantryStorage = 'cold' | 'dry' | 'frozen'; // Ngăn mát · Kệ khô · Ngăn đông
export type PantryDateKind = 'use-by' | 'best-before'; // Hạn sử dụng (Use by) · Nên dùng trước (Best before)
export type PantryFreshness = 'good' | 'soon' | 'overdue'; // Còn hạn · Sắp hạn · Quá hạn

export type PantryItem = {
  id: string;
  name: string;
  category: PantryCategory;
  icon: string; // svg name (item-specific glyph, e.g. egg inside the milkEggs category)
  quantity: string; // "1 hộp", "6 quả"
  storage: PantryStorage;
  dateKind: PantryDateKind;
  expiry: string; // ISO yyyy-mm-dd
  reminder?: PantryReminder; // SB-085
};

export type PantryReminder = { enabled: boolean; daysBefore: 1 | 2; time: '07:30' | '17:30' };

// SB-089 history row: "Đã thêm · 6 quả, Ngăn mát" = status + detail.
export type PantryEvent = {
  id: string;
  name: string;
  icon: string; // svg name
  status: string; // "Đã dùng" | "Đã bỏ" | "Đã thêm" | "Đã cập nhật ngày hạn" | "Đổi nơi cất"
  detail: string; // "1 ổ"
  when: string; // "18/10 · 19:00"
};

// ---- Account (SB-092…100) ----
export type SavedArea = {
  id: string;
  name: string;
  district: string;
  radiusM: 500 | 1000 | 2000;
  isDefault?: boolean;
};

export type NotificationItem = {
  id: string;
  group: 'order' | 'pantry';
  icon: string; // svg name or 'receipt'
  tone: 'brand' | 'warm';
  title: string;
  subtitle: string;
  when: string;
  unread?: boolean;
};

export type ImpactEntry = {
  id: string;
  name: string;
  amount: number; // VND
  date: string; // dd/mm/yyyy
  image: number; // require()d thumbnail
};

export type HelpTopic = { id: string; icon: string; title: string; subtitle: string };
