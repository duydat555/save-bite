import { PANTRY_TODAY, dateKindLabel } from '@/constants/pantry';
import type { PantryFreshness, PantryItem } from '@/types';

const DAY = 24 * 60 * 60 * 1000;

/** Whole days from the Figma "today" to the expiry date (negative = already past). */
export function daysUntil(expiryIso: string, today = PANTRY_TODAY): number {
  return Math.round((Date.parse(expiryIso) - Date.parse(today)) / DAY);
}

/** Foundations: Fresh > 3 days · Expiring 1–2 days · Overdue = use-by passed. */
export function freshnessOf(expiryIso: string, today = PANTRY_TODAY): PantryFreshness {
  const d = daysUntil(expiryIso, today);
  if (d < 0) return 'overdue';
  if (d <= 2) return 'soon';
  return 'good';
}

/** "2026-10-21" → "21/10/2026". */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** "21/10/2026" → "2026-10-21", or null when invalid. */
export function parseDate(text: string): string | null {
  const m = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  const t = new Date(iso);
  return Number.isNaN(t.getTime()) || t.toISOString().slice(0, 10) !== iso ? null : iso;
}

/** Row caption: "Hạn sử dụng (Use by) · 21/10/2026", or "Đã qua hạn sử dụng · 18/10/2026" when overdue. */
export function expiryCaption(item: Pick<PantryItem, 'dateKind' | 'expiry'>): string {
  const date = formatDate(item.expiry);
  return freshnessOf(item.expiry) === 'overdue'
    ? `Đã qua hạn sử dụng · ${date}`
    : `${dateKindLabel[item.dateKind]} · ${date}`;
}
