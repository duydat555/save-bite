import { formatMerchantLine, formatPrice, formatStock, formatTimeRange } from '@/utils/format';
import type { OfferWithMerchant } from '@/types';

/** Maps an offer to the strings shown on OfferCard (SB-015 grid). */
export function toCardProps(offer: OfferWithMerchant) {
  return {
    image: offer.image,
    stockLabel: formatStock(offer.remaining, offer.unit),
    merchantLine: formatMerchantLine(offer.merchant, 'card'),
    title: offer.title,
    pickupLabel: `Nhận ${formatTimeRange(offer.pickupStart, offer.pickupEnd)}`,
    priceLabel: formatPrice(offer.priceVnd),
  };
}

/** Maps an offer to the strings shown on OfferListRow (SB-015 list). */
export function toRowProps(offer: OfferWithMerchant) {
  return {
    image: offer.image,
    title: offer.title,
    merchantLine: formatMerchantLine(offer.merchant, 'row'),
    priceLabel: formatPrice(offer.priceVnd),
    availabilityLabel: `${formatTimeRange(offer.pickupStart, offer.pickupEnd)} · ${formatStock(offer.remaining, offer.unit)}`,
  };
}
