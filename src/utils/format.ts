import type { Merchant } from '@/types';

/** 25000 → "25.000đ" (vi-VN grouping with "." and trailing "đ", as in Figma). */
export function formatPrice(vnd: number): string {
  const digits = Math.round(vnd).toString();
  return `${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;
}

/** ("17:00", "18:00") → "17:00–18:00" (en dash, as in Figma). */
export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}

/** 450 → "450m". Distances ≥ 1000 m are not in Figma yet; shown as km with a comma (TBD). */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1).replace('.', ',')}km`;
}

/** 3 → "Còn 3 phần" (surprise bags: "Còn 2 túi"). */
export function formatStock(remaining: number, unit = 'phần'): string {
  return `Còn ${remaining} ${unit}`;
}

/**
 * Merchant line variants seen in Figma:
 *  card → "Tiệm Bánh A · 450m" · row → "Bếp Xanh Campus · Cách 350m" · no distance → "Quầy Rau C".
 */
export function formatMerchantLine(merchant: Merchant, style: 'card' | 'row' = 'card'): string {
  if (merchant.distanceM == null) return merchant.name;
  const distance = formatDistance(merchant.distanceM);
  return `${merchant.name} · ${style === 'row' ? `Cách ${distance}` : distance}`;
}
