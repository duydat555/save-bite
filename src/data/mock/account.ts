import type { HelpTopic, ImpactEntry, NotificationItem, PantryEvent, SavedArea } from '@/types';

// Literal Figma content for SB-089 / 093 / 095 / 099 / 100.
export const pantryHistorySeed: PantryEvent[] = [
  {
    id: 'h1',
    name: 'Bánh mì men tự nhiên',
    icon: 'bread',
    status: 'Đã dùng',
    detail: '1 ổ',
    when: '18/10 · 19:00',
  },
  {
    id: 'h2',
    name: 'Rau cải ngọt',
    icon: 'carrot',
    status: 'Đã bỏ',
    detail: '1 bó',
    when: '18/10 · 18:20',
  },
  {
    id: 'h3',
    name: 'Sữa tươi thanh trùng',
    icon: 'milk-carton',
    status: 'Đã cập nhật ngày hạn',
    detail: '21/10',
    when: '18/10 · 17:45',
  },
  {
    id: 'h4',
    name: 'Trứng gà ta',
    icon: 'egg',
    status: 'Đã thêm',
    detail: '6 quả, Ngăn mát',
    when: '18/10 · 17:30',
  },
  {
    id: 'h5',
    name: 'Gạo',
    icon: 'grains',
    status: 'Đổi nơi cất',
    detail: 'Kệ khô',
    when: '17/10 · 20:10',
  },
  {
    id: 'h6',
    name: 'Sữa chua không đường',
    icon: 'milk-carton',
    status: 'Đã thêm',
    detail: '1 hộp, Ngăn mát',
    when: '17/10 · 18:05',
  },
  {
    id: 'h7',
    name: 'Đậu Hà Lan',
    icon: 'carrot',
    status: 'Đã thêm',
    detail: '1 túi, Ngăn đông',
    when: '16/10 · 19:00',
  },
];

export const savedAreasSeed: SavedArea[] = [
  {
    id: 'a1',
    name: 'Khu học xá ĐH Đà Nẵng',
    district: 'Quận Liên Chiểu, Đà Nẵng',
    radiusM: 1000,
    isDefault: true,
  },
  { id: 'a2', name: 'Ký túc xá / Nhà trọ', district: 'Quận Hải Châu, Đà Nẵng', radiusM: 500 },
];

export const notificationsSeed: NotificationItem[] = [
  {
    id: 'n1',
    group: 'order',
    icon: 'bell',
    tone: 'brand',
    title: 'Đơn của bạn đã sẵn sàng',
    subtitle: 'Tiệm Bánh A · Nhận 17:00–18:00',
    when: 'Hôm nay · 15:50',
    unread: true,
  },
  {
    id: 'n2',
    group: 'order',
    icon: 'receipt',
    tone: 'warm',
    title: 'Đã giữ chỗ thành công',
    subtitle: 'Tiệm Bánh A · Thanh toán tại quầy',
    when: 'Hôm nay · 15:30',
  },
  {
    id: 'n3',
    group: 'pantry',
    icon: 'milk-carton',
    tone: 'warm',
    title: 'Đừng quên sữa trong tủ',
    subtitle: 'Hạn sử dụng 21/10 · Ngăn mát',
    when: 'Hôm nay · 07:30',
    unread: true,
  },
  {
    id: 'n4',
    group: 'pantry',
    icon: 'milk-carton',
    tone: 'brand',
    title: 'Sữa chua đã được thêm vào tủ',
    subtitle: 'Ngăn mát · Hạn sử dụng 25/10',
    when: '18/10 · 19:45',
  },
  {
    id: 'n5',
    group: 'pantry',
    icon: 'grains',
    tone: 'brand',
    title: 'Gạo đã được thêm vào tủ',
    subtitle: 'Kệ khô · Nên dùng trước 15/11',
    when: '18/10 · 18:30',
  },
  {
    id: 'n6',
    group: 'pantry',
    icon: 'egg',
    tone: 'brand',
    title: 'Trứng đã được thêm vào tủ',
    subtitle: 'Ngăn mát · Nên dùng trước 26/10',
    when: '17/10 · 19:10',
  },
  {
    id: 'n7',
    group: 'pantry',
    icon: 'carrot',
    tone: 'brand',
    title: 'Đậu Hà Lan đã được thêm vào tủ',
    subtitle: 'Ngăn đông · Hạn sử dụng 28/10',
    when: '16/10 · 19:00',
  },
];

export const helpTopics: HelpTopic[] = [
  {
    id: 'q1',
    icon: 'pickup-pass',
    title: 'Tôi cần làm gì khi nhận món?',
    subtitle: 'Mở mã nhận để nhân viên xác thực.',
  },
  {
    id: 'q2',
    icon: 'warning-circle',
    title: 'Nếu không kịp đến nhận?',
    subtitle: 'Bạn có thể hủy miễn phí trước giờ nhận.',
  },
  {
    id: 'q3',
    icon: 'calendar-24',
    title: 'Ngày hạn trên tủ lấy từ đâu?',
    subtitle: 'Bạn tự nhập theo nhãn sản phẩm.',
  },
  {
    id: 'q4',
    icon: 'fridge',
    title: 'Dữ liệu có lưu trên đám mây?',
    subtitle: 'Tủ hiện lưu cục bộ trên thiết bị.',
  },
];

// SB-100 rows; the progress bar is the amount relative to the largest one.
export const impactEntries: ImpactEntry[] = [
  {
    id: 'i1',
    name: 'Bánh mì men tự nhiên',
    amount: 25000,
    date: '19/10/2026',
    image: require('@assets/images/offers/bread-sourdough.jpg'),
  },
  {
    id: 'i2',
    name: 'Bánh sừng bò bơ Pháp',
    amount: 30000,
    date: '17/10/2026',
    image: require('@assets/images/offers/croissant.jpg'),
  },
  {
    id: 'i3',
    name: 'Cơm gà áp chảo & rau củ',
    amount: 35000,
    date: '14/10/2026',
    image: require('@assets/images/offers/chicken-rice-thumb.jpg'),
  },
];
