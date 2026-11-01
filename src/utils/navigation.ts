import { router } from 'expo-router';

export const SURPRISE_OFFER_ID = 'offer-tui-banh-bat-ngo';

/** Opens an offer: the surprise bag has its own screen (SB-044), everything else uses the generic detail (SB-034). */
export function openOffer(id: string) {
  if (id === SURPRISE_OFFER_ID) router.push('/offer/surprise-bag');
  else router.push({ pathname: '/offer/[id]', params: { id } });
}
