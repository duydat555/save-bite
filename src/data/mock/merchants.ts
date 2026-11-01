import type { Merchant } from '@/types';

import { MERCHANT_COORDS } from './mapPins';

// Only merchants visible in Figma so far (SB-015). Add more as screens are read.
export const merchants: Merchant[] = [
  {
    id: 'merchant-tiem-banh-a',
    coord: MERCHANT_COORDS['merchant-tiem-banh-a'],
    name: 'Tiệm Bánh A',
    distanceM: 450,
    pickupPoint: 'Điểm nhận A · ĐH Đà Nẵng · 450m',
    photo: require('@assets/images/store-bakery.jpg'),
  },
  {
    id: 'merchant-bep-xanh-campus',
    name: 'Bếp Xanh Campus',
    distanceM: 350,
    coord: MERCHANT_COORDS['merchant-bep-xanh-campus'],
  },
  { id: 'merchant-quay-rau-c', name: 'Quầy Rau C', coord: MERCHANT_COORDS['merchant-quay-rau-c'] }, // figma: no distance shown
];
