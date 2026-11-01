import {
  formatDistance,
  formatMerchantLine,
  formatPrice,
  formatStock,
  formatTimeRange,
} from '@/utils/format';

describe('format', () => {
  it('formats prices like Figma', () => {
    expect(formatPrice(25000)).toBe('25.000đ');
    expect(formatPrice(29000)).toBe('29.000đ');
    expect(formatPrice(1250000)).toBe('1.250.000đ');
    expect(formatPrice(500)).toBe('500đ');
  });

  it('formats pickup windows with an en dash', () => {
    expect(formatTimeRange('17:00', '18:00')).toBe('17:00–18:00');
  });

  it('formats distance and stock', () => {
    expect(formatDistance(450)).toBe('450m');
    expect(formatStock(3)).toBe('Còn 3 phần');
  });

  it('formats merchant lines for card, row and missing distance', () => {
    expect(formatMerchantLine({ id: 'a', name: 'Tiệm Bánh A', distanceM: 450 })).toBe(
      'Tiệm Bánh A · 450m',
    );
    expect(formatMerchantLine({ id: 'b', name: 'Bếp Xanh Campus', distanceM: 350 }, 'row')).toBe(
      'Bếp Xanh Campus · Cách 350m',
    );
    expect(formatMerchantLine({ id: 'c', name: 'Quầy Rau C' }, 'row')).toBe('Quầy Rau C');
  });
});
