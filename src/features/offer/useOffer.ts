import { useEffect, useState } from 'react';

import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

/** undefined = loading, null = not found. */
export function useOffer(id: string | undefined) {
  const [offer, setOffer] = useState<OfferWithMerchant | null | undefined>(undefined);
  useEffect(() => {
    if (!id) return;
    let live = true;
    offerService.getOffer(id).then((o) => live && setOffer(o ?? null));
    return () => {
      live = false;
    };
  }, [id]);
  return offer;
}
