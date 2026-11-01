# 02 · Design tokens

Nguồn: Figma page **Foundations** (`SaveBite Design System v1.0 · Warm Editorial Rescue Market`, node `11:59`) + `get_variable_defs` trên SB-015, OfferCard, BottomNav, SB-056.
Target: iPhone 15 (393×852pt · Dynamic Island 59pt · Home Indicator 34pt). 4 cấp bề mặt (Level 0–3).
`src/design-system/tokens/*` phải khớp 1-1 file này. Mục **TBD** = chưa đọc được hex/giá trị, sẽ lấy khi dựng màn dùng nó.

## Màu (đã xác nhận)

| Token             | Hex                  | Vai trò Figma                                                                                                       |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `brand900`        | `#004337`            | Level 3 · Focal / CTA (var `color-brand-900`)                                                                       |
| `brand700`        | `#2D7055`            | Secondary brand; chữ giờ nhận "Nhận 17:00–18:00"                                                                    |
| `brand100`        | `#EDF3E7`            | Level 1 · Sage Well (var `color-brand-100`)                                                                         |
| `canvas`          | `#FFFCF6`            | Level 0 · Open Canvas, nền màn (var `color-surface-canvas`)                                                         |
| `surfaceSubtle`   | `#F4EFE6`            | Level 1 · Inset Group: ô tìm kiếm, category tile (var `color-surface-subtle`)                                       |
| `surfaceElevated` | `#FFFFFF`            | Level 2 · Entity Card                                                                                               |
| `price`           | `#B34021`            | Rescue Price · Accent giá & khẩn                                                                                    |
| `textPrimary`     | `#092F29`            | Primary Ink, 14.1:1                                                                                                 |
| `textSecondary`   | `#606E66`            | Text Meta, 5.2:1 (var `color-text-secondary`)                                                                       |
| `textInverse`     | `#FFFFFF`            | Chữ trên nền brand (var `color-text-inverse`)                                                                       |
| `success`         | `#25603C`            | Fresh Safe · Pantry > 3 ngày (var `color-semantic-success`)                                                         |
| `successBg`       | `#EDF3E7`            | var `color-semantic-success-bg`                                                                                     |
| `warning`         | `#9A5400`            | Expiring Soon · Pantry 1–2 ngày (var `color-semantic-warning`)                                                      |
| `warningBg`       | `#FEF6EE`            | var `color-semantic-warning-bg`                                                                                     |
| `danger`          | `#B42318`            | Overdue Alert · quá hạn                                                                                             |
| `cardBorder`      | `#E8E2D8`            | viền OfferCard/OfferListRow, 1px (`sds-size-stroke-border`=1). _Giá trị hex thẳng trong layer, không phải variable_ |
| `homeIndicator`   | `rgba(9,47,41,0.85)` | thanh home 134×5                                                                                                    |
| `systemBlack`     | `#000000`            | Dynamic Island, chữ status bar                                                                                      |

**TBD:** `dangerBg`, `Wheat`, `Paper`, `Sage`, `Terracotta` (Brand Suite · Mầm R1, node `231:570`), neutral tag, `Fills - Vibrant/Tertiary` = `#EDEDED` (nền glass nút tròn), màu tag Positive/Warning/Danger/Neutral (node `628:966`).

## Typography

Font: **Be Vietnam Pro** (sans) cho giao diện; **Fraunces Bold** (serif) cho tiêu đề editorial (onboarding 30/36, xác minh email 28/34); **JetBrains Mono Bold** cho mã nhận món; iOS native (status bar, tab bar, nút glass) dùng SF Pro hệ thống. **Đính chính:** bản Phase 1 ghi "không có serif" là sai — Figma dùng Fraunces ở các màn onboarding/xác minh email. Trục SOFT/WONK của Fraunces không có trong font tĩnh của Expo (xấp xỉ).

Kiểu chữ đã quan sát trong SB-015 (family Be Vietnam Pro):

| Dùng cho                                 | Weight        | Size / line-height                 |
| ---------------------------------------- | ------------- | ---------------------------------- |
| Tên thương hiệu header ("Chào Minh Anh") | ExtraBold 800 | 20 / normal                        |
| Banner tiêu đề ("Túi bánh bất ngờ")      | Bold 700      | 22 / 26                            |
| Tiêu đề mục ("Chọn cho chiều nay")       | Bold 700      | 16 / normal                        |
| Giá OfferCard                            | Bold 700      | 18 / normal                        |
| Giá OfferListRow                         | Bold 700      | 16 / normal                        |
| Tên món (card, row)                      | SemiBold 600  | 15 / 20 (card) · 15 / normal (row) |
| Link "Bản đồ →"                          | SemiBold 600  | 13 / normal                        |
| Nhãn category tile                       | SemiBold 600  | 12 / 16                            |
| Dòng giờ nhận, meta cửa hàng/khoảng cách | Medium 500    | 12 / normal                        |
| Banner phụ ("29.000đ · 18:00–19:00")     | Medium 500    | 12 / 18                            |
| Meta tên cửa hàng trên card              | Medium 500    | 11 / normal                        |
| Placeholder ô tìm kiếm                   | Regular 400   | 14 / 22, tracking -0.43            |
| Status bar giờ (SF Pro)                  | Semibold 590  | 17 / 22, tracking -0.43            |

Cần nạp (`@expo-google-fonts/be-vietnam-pro`): Regular, Medium, SemiBold, Bold, ExtraBold. Bảng đầy đủ các style còn lại: **TBD**, bổ sung theo từng màn. Figma có text style `type` nhưng chỉ lộ SF Pro 17pt qua variables.

## Radius

| Token          | px  | Dùng cho                                            |
| -------------- | --- | --------------------------------------------------- |
| `deviceScreen` | 50  | khung thiết bị (chỉ mockup, **không** áp trong app) |
| `md`           | 20  | OfferCard, FeaturedHeroBanner (var `radius-md`)     |
| `listRow`      | 18  | OfferListRow                                        |
| `tile`         | 16  | CategoryTile                                        |
| `input`        | 14  | ô tìm kiếm, nút bộ lọc                              |
| `thumb`        | 12  | ảnh thumbnail trong row                             |
| `tag`          | 8   | nhãn "Còn 3 phần"                                   |
| `pill`         | 999 | nút tròn, home bar (var `radius-pill`)              |

## Spacing

Biến `sds-size-space-200` = 8, `sds-size-space-300` = 12. Lề màn hình 20; gap dọc giữa section 16; gap trong card 4; gap tile 8; gap lưới 2 cột 15; padding card body 12 (dọc 10/12). Thang đầy đủ: **TBD**.

## Kích thước cố định quan sát được

Status bar 59 · BrandHeader 56 (top 59) · BottomNav 95 · search 36 (hit area 48/50) · nút glass 50×50 · CategoryTile 82×64 (component 82×74) · OfferCard rộng 169, ảnh 118 cao, min-h 246 · OfferListRow 92, ảnh 72 · FeaturedHeroBanner 112, minh hoạ 112×112 ở x=241 · nội dung scroll thêm `paddingBottom` 104 để không bị tab bar che.

## Shadow / Effect

Figma có effect style `effect` nhưng chưa lộ giá trị; OfferCard dùng viền 1px thay vì shadow. **TBD** theo từng màn (BottomNav, sheet, Pickup Pass).

## Liquid Glass (iOS 26 native)

Biến: Opacity 25 · Refraction 70 · Frost 6 · Light Angle 0 · Splay 20 · Depth 30 · Dispersion 20. Dùng cho nút tròn (heart/bell/filter, 50×50) và Tab Bar. **Không tái tạo được đúng trong Expo Go** → xem rủi ro ở `07-ARCHITECTURE.md` / báo cáo Phase 1.

## Bổ sung ở Vòng 1 (đọc từ SB-001…008, 015, 034, 051/053/056, 060/062/063, 091)

- Màu mới: `borderDefault` #E8E2D8 (var color-border-default; đổi tên từ cardBorder), `wheatLight` #F1D8AF, `borderControl` #7B8A80 (viền input), `inputText` #1E1E1E, `warningBorder` #F1DEC6, literal: #D5CEC2 (chấm trang SB-002), #F2F2ED (phụ đề SB-005), #D7834B 16% (hình tròn SB-002).
- Chữ mới: Fraunces 700 30/36 (-0.45) và 28/34 (-0.42); Be Vietnam Pro 44/54 (splash), 36/44 và 18/22 (wordmark), 29/36, 26 (large title), 24, 21, 17 (app bar); JetBrains Mono Bold (mã nhận ~22, **ước lượng**). Chi tiết: `src/design-system/tokens/typography.ts`.
- **Ước lượng từ screenshot** (Figma bọc bằng Code Connect nên không lộ số): cỡ chữ nút (16 SemiBold), nhãn/ô nhập (14 SemiBold / 16 Regular, radius 14), nút Primary disabled (nền #F4EFE6, chữ #606E66), nút "Chỉnh sửa" SB-091, hình học tab bar kính, shadow glass.
