import { offerRepository } from '@/data/repositories/offerRepository';
import { toCardProps } from '@/features/discovery/offerPresenter';

jest.mock('@/data/repositories/latency', () => ({ simulateLatency: () => Promise.resolve() }));

describe('offerRepository', () => {
  it('lists offers joined with their merchant', async () => {
    const list = await offerRepository.list();
    expect(list).toHaveLength(5);
    expect(list.every((o) => o.merchant?.id === o.merchantId)).toBe(true);
  });

  it('matches the SB-015 card text exactly', async () => {
    const offer = await offerRepository.getById('offer-banh-mi-men-tu-nhien');
    expect(offer).toBeDefined();
    const card = toCardProps(offer!);
    expect(card.stockLabel).toBe('Còn 3 phần');
    expect(card.merchantLine).toBe('Tiệm Bánh A · 450m');
    expect(card.pickupLabel).toBe('Nhận 17:00–18:00');
    expect(card.priceLabel).toBe('25.000đ');
  });

  it('searches accent-insensitively by title or merchant', async () => {
    expect((await offerRepository.search('banh mi')).map((o) => o.id)).toContain(
      'offer-banh-mi-men-tu-nhien',
    );
    expect(await offerRepository.search('COM GA')).toHaveLength(1);
    expect(await offerRepository.search('bánh chay')).toHaveLength(0);
  });

  it('returns undefined for an unknown offer', async () => {
    expect(await offerRepository.getById('nope')).toBeUndefined();
  });
});
