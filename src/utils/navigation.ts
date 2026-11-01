import { router } from 'expo-router';

import { useFilters } from '@/store/filterStore';

export const SURPRISE_OFFER_ID = 'offer-tui-banh-bat-ngo';

/**
 * Opens an offer: the surprise bag has its own screen (SB-044); with a dietary filter active every dish first shows the
 * allergen-conflict screen (SB-049, no merchant declares allergens); otherwise the generic detail (SB-034).
 */
export function openOffer(id: string) {
  if (id === SURPRISE_OFFER_ID) router.push('/offer/surprise-bag');
  else if (useFilters.getState().dietary.length > 0)
    router.push({ pathname: '/offer/[id]/allergen-conflict', params: { id } });
  else router.push({ pathname: '/offer/[id]', params: { id } });
}
