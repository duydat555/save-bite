# 03 · Component spec

Nguồn: Figma page **Components** (`11:2`). Kích thước = width×height trong Figma (pt). Props/states đã xác nhận chỉ cho component có trong SB-015; còn lại ghi theo **tên + kích thước** và bổ sung props khi dựng màn đầu tiên dùng nó. Mỗi component → `src/components/ui` (chung) hoặc `src/components/features` (nghiệp vụ).

## Khung & điều hướng

| Component        | Node   | Kích thước | Ghi chú                                                                                                                               |
| ---------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| iOSStatusBar     | 15:2   | 393×59     | không tự vẽ: dùng status bar hệ thống (`expo-status-bar`)                                                                             |
| iOSHomeIndicator | 15:17  | 393×34     | do iOS tự vẽ; **không** dựng lại                                                                                                      |
| BrandHeader      | 15:89  | 393×56     | logo BagMark 24 + "Chào {tên}" + dòng khu vực "Đà Nẵng · Khu học xá ▾"; 2 nút glass 50 (heart 265,62 / bell 323,62)                   |
| AppBar           | 15:105 | 393×56     |                                                                                                                                       |
| LargeTitleBar    | 15:111 | 393×56     |                                                                                                                                       |
| MediaOverlayBar  | 15:115 | 393×56     | trên ảnh (gallery/detail)                                                                                                             |
| BottomNav        | 15:122 | 393×95     | native Tab Bar 4 tab: Khám phá (house) · Đơn của tôi (document) · Tủ thực phẩm (shippingbox) · Tài khoản (person); tab chọn nền glass |

## Khám phá

| Component          | Node           | Kích thước                    | Ghi chú                                                                                                                                                           |
| ------------------ | -------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CategoryTile       | 15:153         | 82×74 (dùng 82×64)            | variant Selected (nền `brand900`, chữ `canvas`, icon 24) / Default (nền `surfaceSubtle`, icon Phosphor 32, chữ `textPrimary`); radius 16                          |
| OfferCard          | 15:160         | 170×236 (dùng 169, min-h 246) | ảnh 118 + tag tồn kho ("Còn N phần", SDS Tag Positive Secondary) góc (10,10); body: cửa hàng·khoảng cách / tên / giờ nhận / giá. Viền 1px `cardBorder`, radius 20 |
| OfferListRow       | 15:169         | 353×92                        | ảnh 72 radius 12; tên / cửa hàng·khoảng cách / giá + "giờ · Còn N phần"; radius 18                                                                                |
| FeaturedHeroBanner | (trong SB-015) | 353×112                       | nền `brand900`, radius 20, minh hoạ túi bánh phải                                                                                                                 |
| SearchField        | 16:18          | 353×48                        | dựa trên AppleKit Search Input (cao 36, nền `surfaceSubtle`, radius 14) + nút bộ lọc 50                                                                           |
| FilterChip         | 98:144         | 180×36                        | variants `Selected=false/true`                                                                                                                                    |
| SegmentedControl   | 98:139         | 353×44                        | `Active=Tab1/Tab2/Tab3`                                                                                                                                           |
| MapCanvas          | 16:3           | 393×540                       | xem rủi ro map                                                                                                                                                    |
| MapPricePin        | 16:16          | 88×43                         | pin giá                                                                                                                                                           |
| MerchantRow        | 16:31          | 353×65                        |                                                                                                                                                                   |
| PickupInfo         | 16:40          | 353×64                        |                                                                                                                                                                   |

## Đặt giữ chỗ & đơn

AllergenNotice 16:49 (353×82) · ReservationProgress 16:57 (353×36) · OfferSummary 16:63 (353×76) · PickupSlot 16:69 (353×78) · UnifiedReceiptCard 16:76 (353×288) · DemoQR 16:100 (148×148) · PerforatedPickupPass 16:124 (353×384) · ActiveOrderCard 624:979 (353×96).

## Pantry & tài khoản

PantryItemRow 16:171 (353×112) · PantryCategoryTile 88:66 (82×86) và `Pantry/CategoryTile` 150:246 (8 variant 168×112: Bakery, MilkEggs, Produce, Fruit, Prepared, MeatFish, Spices, Other) · PantryOverviewHero 624:1246 (353×88) · ProfileHeaderCard 16:180 (353×84) · ImpactHeroCard 16:186 (353×114) · EmptyState 98:109 (353×272).

## Form & nhãn (từ SDS/Apple kit)

Button (52pt, 3 trạng thái gồm Disabled, node 198:215/223/231) · Input Field (348×74, 198:239) · Checkbox Field / Radio Field (44) · Tag SDS (Positive/Warning/Danger/Neutral, cao 28; node 628:966) · Tag Toggle Pantry (cao 44, node 431:838) · Toggle Apple27 (`IsOn=true/false`, 64×48 hit area) · AppleKit Keyboard Email/Text (393×291, bàn phím hệ thống — dùng bàn phím thật, không dựng lại).

## Thương hiệu

`Brand/RescueMark` (Forest, Cream), `Brand/BagMark` (Forest, Cream, Wheat), `Brand/Wordmark R1` (Forest, Cream), `Brand/Mầm` mascot 8 pose (Hello, Carry, Kitchen, Quiet, Retry, Celebrate, Mail, Search — 240×240), `Brand/Pattern` (Leaf, Stripe, Receipt, Fold, Plain), `Brand/SeedActivity` (loading 3 pha + Static, 96×24). Quy tắc: mascot chỉ ở trạng thái chào / chờ / trống / kết thúc; **không** ở cảnh báo dị ứng, xác nhận hủy hay mã QR.

## Icon

- **Phosphor Core** 24px: Bag, Bell, Calendar, CaretRight, Check, Clock, ForkKnife, Heart, Info, MagnifyingGlass, MapPin, Plus, Receipt, Tag, Trash, Warning, X, chat-circle-text, Fridge, Basket, DownloadSimple.
- **Phosphor Duotone** 32px (thực phẩm): bread, bowl-food, carrot, plant, egg, orange-slice, fish, cheese, grains, jar, snowflake.
- **SaveBite**: MilkCarton, PickupPass, Pantry.
- Một số icon trong SB-015 (heart/bell/filter, tab) là **SF Symbols** (`heart`, `bell`, `slider.horizontal.3`, `house.fill`, `document`, `shippingbox`, `person`).
