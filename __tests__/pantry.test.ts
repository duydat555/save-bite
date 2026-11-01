import {
  daysUntil,
  formatAmount,
  freshnessOf,
  parseDate,
  parseQuantity,
  shortDate,
} from '@/utils/pantry';

describe('pantry utils', () => {
  it('classifies freshness against the Figma "today" (19/10/2026)', () => {
    expect(freshnessOf('2026-10-21')).toBe('soon');
    expect(freshnessOf('2026-10-26')).toBe('good');
    expect(freshnessOf('2026-10-18')).toBe('overdue');
    expect(daysUntil('2026-10-20')).toBe(1);
  });

  it('parses and formats dates', () => {
    expect(parseDate('21/10/2026')).toBe('2026-10-21');
    expect(parseDate('31/02/2026')).toBeNull();
    expect(shortDate('2026-10-21')).toBe('21/10');
  });

  it('parses quantities and formats fractions', () => {
    expect(parseQuantity('1 hộp')).toEqual({ amount: 1, unit: 'hộp' });
    expect(parseQuantity('1/2 hộp')).toEqual({ amount: 0.5, unit: 'hộp' });
    expect(parseQuantity('6 quả').amount).toBe(6);
    expect(formatAmount(0.5)).toBe('1/2');
    expect(formatAmount(0.75)).toBe('3/4');
    expect(formatAmount(4.5)).toBe('4,5');
  });
});
