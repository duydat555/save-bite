import type { Merchant } from '@/types';

// Only merchants visible in Figma so far (SB-015). Add more as screens are read.
export const merchants: Merchant[] = [
  {
    id: 'merchant-tiem-banh-a',
    name: 'Tiệm Bánh A',
    distanceM: 450,
    pickupPoint: 'Điểm nhận A · ĐH Đà Nẵng · 450m',
    photo: require('@assets/images/store-bakery.jpg'),
  },
  { id: 'merchant-bep-xanh-campus', name: 'Bếp Xanh Campus', distanceM: 350 },
  { id: 'merchant-quay-rau-c', name: 'Quầy Rau C' }, // figma: no distance shown
];
