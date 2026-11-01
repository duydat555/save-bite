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

/** "2026-10-21" → "21/10". */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

/** "Hạn sử dụng" / "Nên dùng trước" (without the "(Use by)" suffix) — SB-083/084 captions. */
export function dateKindShort(kind: PantryItem['dateKind']): string {
  return kind === 'use-by' ? 'Hạn sử dụng' : 'Nên dùng trước';
}

/** "1 hộp" → { amount: 1, unit: 'hộp' }; "1/2 hộp" → { 0.5, 'hộp' }. Unparseable → amount 1. */
export function parseQuantity(q: string): { amount: number; unit: string } {
  const m = q.trim().match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)\s*(.*)$/);
  if (!m) return { amount: 1, unit: q.trim() };
  const [num, den] = m[1].split('/');
  const amount = den ? Number(num) / Number(den) : Number(num.replace(',', '.'));
  return { amount: Number.isFinite(amount) ? amount : 1, unit: m[2] };
}

/** 0.5 → "1/2", 0.25 → "1/4", 0.75 → "3/4", 4.5 → "4,5". */
export function formatAmount(n: number): string {
  const frac: Record<string, string> = { '0.25': '1/4', '0.5': '1/2', '0.75': '3/4' };
  const f = frac[String(Math.round(n * 100) / 100)];
  if (f) return f;
  return String(Math.round(n * 10) / 10).replace('.', ',');
}
