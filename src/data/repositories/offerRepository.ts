import { merchants } from '@/data/mock/merchants';
import { offers } from '@/data/mock/offers';
import type { Merchant, Offer, OfferWithMerchant } from '@/types';

import { simulateLatency } from './latency';

function withMerchant(offer: Offer): OfferWithMerchant {
  const merchant = merchants.find((m) => m.id === offer.merchantId) as Merchant;
  return { ...offer, merchant };
}

/** Lower-case, accent-insensitive key so "banh mi" finds "Bánh mì". */
export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().trim();

export const offerRepository = {
  /** Mock search: matches offer title or merchant name. */
  async search(query: string): Promise<OfferWithMerchant[]> {
    await simulateLatency();
    const q = normalize(query);
    if (!q) return [];
    return offers
      .map(withMerchant)
      .filter((o) => normalize(o.title).includes(q) || normalize(o.merchant.name).includes(q));
  },

  async list(): Promise<OfferWithMerchant[]> {
    await simulateLatency();
    return offers.map(withMerchant);
  },

  async getById(id: string): Promise<OfferWithMerchant | undefined> {
    await simulateLatency();
    const offer = offers.find((o) => o.id === id);
    return offer ? withMerchant(offer) : undefined;
  },
};
