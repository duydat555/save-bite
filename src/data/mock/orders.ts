// "Đã hoàn tất gần đây" rows from SB-060 (literal Figma text) and the impact numbers from SB-091.
export type CompletedOrderFixture = {
  id: string;
  title: string;
  image: number;
  metaLine: string; // "Đã nhận · 17/10 · Tiệm Bánh A"
  priceVnd: number;
};

export const completedOrders: CompletedOrderFixture[] = [
  {
    id: 'done-1',
    title: 'Bánh sừng bò bơ Pháp',
    image: require('@assets/images/offers/croissant.jpg'),
    metaLine: 'Đã nhận · 17/10 · Tiệm Bánh A',
    priceVnd: 30000,
  },
  {
    id: 'done-2',
    title: 'Cơm gà áp chảo & rau củ',
    image: require('@assets/images/offers/chicken-rice-thumb.jpg'),
    metaLine: 'Đã nhận · 14/10 · Bếp Xanh',
    priceVnd: 35000,
  },
];

export const impactStats = { orders: 3, items: 4 } as const; // SB-091: "3 đơn" / "4 món"
