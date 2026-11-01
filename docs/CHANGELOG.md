# Changelog

## 2026-11-01 — Phase 0 (setup)

- Khởi tạo Expo SDK 58 (blank-typescript) tại root, chuyển sang Expo Router (`main: expo-router/entry`, routes ở `app/`).
- Cài (qua `npx expo install`): expo-router, safe-area-context, screens, linking, constants, font, splash-screen, image, svg, reanimated 4 + worklets, gesture-handler, async-storage, react-dom/react-native-web. Thêm zustand.
- ESLint (eslint-config-expo) + Prettier, `.editorconfig`, tsconfig alias `@/*`, `@assets/*`. Khung thư mục theo spec.
- Kiểm tra: `tsc --noEmit` OK, `expo lint` OK, `expo-doctor` 20/20, `expo export --platform ios` bundle OK.
- **Chặn:** Figma MCP (tài khoản datld.23ite@vku.udn.vn) không có quyền edit file SaveBite V2 → chưa làm Phase 1. Đang chờ chủ file cấp quyền Editor.

## 2026-11-01 — Phase 1 (phân tích Figma)

- Kết nối Figma MCP thành công. Lỗi "no edit access" trước đó do **fileKey sai** (`l` thay vì `I` hoa); key đúng `7suZz9C8oL5zV2NMxlsIVI`.
- Kiểm kê **100 màn** (SB-001…SB-100: 33/17/23/27 theo nhóm 01–04), đều 393×852. `scripts/figma-frames.json` + `scripts/gen-inventory.js` → `docs/01-FIGMA-INVENTORY.md`.
- Viết `docs/00`–`10` (02, 03, 04 có nội dung thật, 05 nháp, 06/08/09 khung). Lưu screenshot mẫu `assets/figma-reference/SB-015.png`.
- Chưa làm: tải screenshot 100 màn (làm theo từng màn ở Phase 3), đọc prototype reactions, bảng typography/spacing/shadow đầy đủ.

## 2026-11-01 — Phase 2 (nền móng)

- Cài expo-blur, expo-symbols, expo-haptics, @expo-google-fonts/be-vietnam-pro (import theo từng weight), jest-expo.
- Tokens (colors, typography, spacing, radius, shadows) + theme khớp `docs/02`. Font nạp ở `app/_layout.tsx`, giữ splash tới khi font xong.
- Component: Text, SvgIcon, GlassButton, Tag, SearchField, CategoryTile, SectionHeader (ui); OfferCard, OfferListRow, BrandHeader, FeaturedHeroBanner, GlassTabBar (features). Chưa làm Button/Input (chờ màn Welcome/Đăng nhập để lấy đúng spec từ Figma).
- Dữ liệu: types, utils/format, mock (3 merchant, 4 offer, 1 user), repositories (delay 200–500ms), services, storage, sessionStore (zustand + AsyncStorage).
- Route: `app/index` (hub checkpoint), `app/dev/foundations` (thư viện màu/font/component), `app/(tabs)` (4 tab placeholder + tab bar kính).
- Asset từ Figma: ảnh offer (đã thu nhỏ), minh hoạ túi bánh, BagMark, icon Phosphor bread/bowl-food/carrot.
- Kiểm tra: tsc, expo lint, jest (7 test), expo-doctor 20/20, expo export ios đều OK. Chưa chạy trên iPhone thật.
- Xấp xỉ cần đối chiếu: GlassTabBar (cao 64, margin 20, pill chọn) ước lượng từ screenshot; shadow glass không lấy từ Figma.

## 2026-11-01 — Vòng 1 (luồng demo chính)

- Đã dựng 17 màn: SB-001…008 (Splash, 3 Onboarding, Welcome, Đăng ký, Xác minh email, Đăng nhập), SB-015 (Khám phá), SB-034 (Chi tiết món), SB-051/053/056 (Giữ chỗ → Biên lai → Vé nhận món), SB-060/062/063 (Đơn của tôi, Chi tiết đơn, Mã nhận món), SB-091 (Tài khoản). Screenshot tham chiếu đã lưu ở `assets/figma-reference/`.
- **Đính chính font:** Figma dùng Fraunces Bold (serif) cho tiêu đề editorial (SB-002/003/004/007) — đã thêm Fraunces + JetBrains Mono.
- Component mới: Button, AppBar, LargeTitleBar, InputField, Checkbox, PageDots, SegmentedControl, SeedActivity, Wordmark, Tag (positive/neutral), InfoRow, AllergenNotice, PickupPass, ReceiptCard, … Luồng đặt chỗ tạo đơn lưu AsyncStorage và hiện ở tab Đơn của tôi.
- Không làm (theo yêu cầu): sheet, màn trạng thái, Pantry, các màn con của Tài khoản. Các nút dẫn tới đó đang để không hoạt động.
- Kiểm tra: tsc, expo lint, jest (7 test), expo export ios đều OK. **Chưa chạy trên thiết bị** — cần bạn duyệt.

## 2026-11-01 — Liquid Glass + Motion

- **A · Kính:** thêm `expo-glass-effect` (docs SDK 58: có trong Expo Go, chỉ iOS 26+). `GlassSurface` chọn GlassView hoặc BlurView và vẽ thêm lớp phủ/sheen/viền gradient/highlight/bóng. `GlassButton` và Tab Bar nổi dùng nó; Tab Bar có viên thuốc trượt bằng spring và icon scale.
- **B · Chuyển động:** `motion.ts`, `PressableScale`, chuyển tab (fade + nhô 10 px), cấu hình animation cho Stack, splash vào/ra, parallax + chấm trang động ở onboarding, stagger + skeleton + pull-to-refresh ở Khám phá và Đơn của tôi, thumb segmented trượt, checkbox đổi màu, luồng xác nhận giữ chỗ có lớp phủ đang xử lý (SB-055, ≥1,2 s) và màn thành công có haptic + Mầm/tick bật lên.
- Đã đọc SB-055 và tải Mầm "Carry". Docs mới: `docs/11-MOTION-SPEC.md`.
- Kiểm tra: tsc, expo lint, jest (7), expo-doctor 20/20, expo export ios đều OK. **Chưa kiểm tra trên thiết bị.**

## 2026-11-01 — Vòng 2 · đợt 1: Tìm kiếm + Bản đồ

- SB-019/020 (`/discover/search`: gần đây + gợi ý nhanh khi trống, gợi ý món/cửa hàng khi gõ), SB-021/022 (`/discover/results`: kết quả hoặc "Chưa có món…" với Mầm Search), SB-016/017 (`/(tabs)/map`: ảnh bản đồ tĩnh + ghim bấm được + peek sheet; tab ẩn nên Tab Bar vẫn hiện, viên thuốc ở "Khám phá").
- Tìm kiếm thật trên dữ liệu mock (không phân biệt dấu); lịch sử tìm lưu AsyncStorage. Thêm offer "Túi bánh bất ngờ" (29.000đ, 18:00–19:00) vì SB-020 hiển thị; **nhà cung cấp là giả định** (chưa đọc SB-044) và offer này không hiện trong feed SB-015.
- Giả định cần xác nhận: chip nhanh "Tối đa 30.000đ" / "Nhận 17:00–18:00" mở danh sách kết quả đã lọc; nút "Lọc" ở bản đồ chưa nối (sheet SB-023).

## 2026-11-01 — Vòng 2 · đợt 2: Chi tiết món/cửa hàng + Tủ thực phẩm

- **Offer & cửa hàng (SB-035…045):** thư viện ảnh (`/offer/[id]/gallery`, Vừa khung/Cận cảnh), sheet Thành phần & dị ứng và Chất lượng & bảo quản, trang cửa hàng, đường tới cửa hàng (ảnh bản đồ tĩnh + pin), quy định nhận món, ưu đãi của tiệm, đánh giá (2 màn trạng thái trống), Túi bánh bất ngờ + sheet giải thích. Khung `SheetModal` dùng chung (scrim, vuốt xuống để đóng). `openOffer()` chuyển offer túi bất ngờ sang SB-044.
- **Dữ liệu:** merchant có ảnh cửa hàng; offer có `unit`/`listTitle` ("Còn 2 túi", "Túi bánh bất ngờ cuối ngày"); xác nhận cửa hàng của túi bất ngờ = Tiệm Bánh A (theo SB-038).
- **Tủ thực phẩm (SB-075…081):** tab Pantry thật với 7 món seed từ Figma, trạng thái Còn hạn/Sắp hạn/Quá hạn tính theo "hôm nay" 19/10/2026, lọc Hạn dùng/Nơi cất, trạng thái trống (SB-076), thêm món (form → sheet loại → lịch chọn ngày → xem lại → lưu), chi tiết thực phẩm. Lưu bằng AsyncStorage. "Dùng"/"Bỏ"/"Đánh dấu…" hiện chỉ xoá món (sheet SB-086/087 chưa dựng).
- `SvgIcon` có `tint` (icon trên nền đậm). `AppBar` có slot `right`.
- Tổng: 42/100 màn ở trạng thái done.
- Lưu ý kiểm tra: `npx eslint app src __tests__` sạch; `npx expo lint` đôi khi báo lỗi parse cũ do cache — chạy lại `eslint` trực tiếp để xác nhận.

## 2026-11-01 — Vòng 2 · đợt 3: Đơn hàng

- **Đặt chỗ:** sheet Chọn số lượng (SB-050, tối đa min(còn lại, 2)) nay nằm giữa Chi tiết món và Chọn giờ; số lượng đi xuyên suốt biên lai/đơn. Hướng dẫn nhận món (SB-052), Chưa giữ được chỗ (SB-057), Số lượng vừa thay đổi (SB-058). Lỗi mạng/hết hàng bật từ dev hub (đúng hai DemoHotspot của SB-055).
- **Đơn:** chi tiết đơn có đủ trạng thái — Chờ nhận (SB-062), Sẵn sàng (066), Sắp hết giờ (067), Hết hạn (068), Hoàn tất (072); Đưa mã cho cửa hàng (064), Điểm nhận (065), Báo sự cố (069), sheet Hủy đơn (070) → Hủy thành công (071); Đơn trống (073, bật bằng "Ẩn lịch sử đơn" ở dev hub). Hotspot "staff scans" ở SB-063 (vùng 120×60) hoàn tất đơn → SB-072. Trạng thái đơn đổi được từ dev hub.
- Thay đổi so với quyết định #3 trước đó: "Chọn số lượng" giờ mở sheet SB-050 (đã có màn). Muốn quay lại đi thẳng SB-051: đổi nút ở `app/offer/[id].tsx`.
- Tổng: 56/100 màn done.

## 2026-11-01 — Vòng 3 · nhóm 04: Tủ thực phẩm (còn lại) + Tài khoản

- **Pantry:** SB-074 giới thiệu (ảnh sữa/trứng + hoa văn lá tải từ Figma), SB-082 sửa món, SB-083 Cần dùng sớm, SB-084 Đã quá hạn dùng, SB-085 nhắc hạn (lưu theo từng món), SB-086 cập nhật lượng dùng (1/4 · 1/2 · Hết, tính lượng còn lại), SB-087 đánh dấu đã bỏ, SB-088 gợi ý từ tủ, SB-089 lịch sử (tự ghi khi thêm/dùng/bỏ/sửa), SB-090 dữ liệu trên máy (xuất JSON/CSV qua Share, xóa có xác nhận).
- **Account:** SB-092 sửa hồ sơ, SB-093 khu vực thường dùng, SB-094 lưu khu vực (vòng bán kính co giãn bằng spring), SB-095/096 thông báo (+ trạng thái trống), SB-097 tùy chọn thông báo, SB-098 quyền riêng tư, SB-099 trợ giúp (tìm kiếm cục bộ), SB-100 tác động.
- Nối các hàng/nút còn treo (xem `docs/04-NAVIGATION-FLOW.md`). SB-086/087 trong Figma là màn đầy đủ, không phải sheet.
- Dùng chung mới: `Choice`, `Toggle` (reanimated, tôn trọng Reduce Motion), `Avatar`, `PantryFlowParts` (ItemSummary/StickyDock/NoticeCard). Dữ liệu qua `accountService → accountRepository`; store mới `accountStore` (khu vực, tùy chọn thông báo); `pantryStore` có `history` + `reminder`.
- Dev hub: lối vào SB-074/083/084/088/095, "Mở SB-064", "Xóa thông báo".
- Kiểm tra: tsc, eslint, jest (11), expo-doctor 20/20, expo export ios đều OK. **Chưa chạy trên thiết bị** — dừng chờ bạn duyệt trước nhóm 01. Tổng: 75/100 màn done.

## 2026-11-02 — Vòng 4 · nhóm 01 + trạng thái còn lại

- **Auth/quyền:** SB-009 quên mật khẩu, SB-010 đã gửi liên kết, SB-011 quyền vị trí, SB-012 quyền thông báo.
- **Khám phá:** SB-013 (khách) / SB-014 (đã đăng nhập, thẻ đơn đang chờ) trên cùng tab; SB-018 chọn khu vực; sheet lọc SB-023…026 (store `filterStore`) + SB-027 sắp xếp, kết quả lọc dùng layout SB-021; danh mục SB-028/029/030 (một màn, tham số `key`), SB-031 Nhận sớm, SB-032 Quanh trường, SB-033 Đã lưu (store `savedStore`). Các màn này là tab ẩn nên Tab Bar vẫn hiện (như SB-016).
- **Trạng thái:** SB-046/047/048 (chi tiết món hết phần / ngoài giờ / gần đóng cửa — bật từ dev hub), SB-049 xung đột dị ứng (tự hiện khi có bộ lọc nhu cầu ăn uống), SB-059 sheet đăng nhập để giữ chỗ (khách), SB-061 Đang chờ nhận · timeline, SB-054 sheet xác nhận giữ chỗ.
- Tự nối các liên kết còn treo theo suy luận — bảng đầy đủ ở `docs/04-NAVIGATION-FLOW.md`.
- Ảnh tải từ Figma: hero danh mục (128×128 — bản Figma xuất 1×, sẽ hơi mờ trên màn Retina), bản đồ, ảnh sữa/trứng.
- Kiểm tra: tsc, eslint, jest (11), expo-doctor 20/20, expo export ios đều OK. **Chưa chạy trên thiết bị.** Tổng: 100/100 màn done.

## 2026-11-02 — Sửa lỗi điều hướng bản đồ / danh mục

- **Nguyên nhân:** SDK 58 coi tab `href: null` là `hidden` và **không cho điều hướng tới**, nên bấm Bản đồ / Bánh mì / Bữa ăn / Rau củ chỉ quay về Khám phá. Các màn SB-016/017, 028–033 vì thế chưa từng mở được.
- **Sửa:** chuyển thành màn stack thường (`/discover/map`, `/discover/category?cat=…`, `/discover/urgent`, `/discover/nearby`, `/discover/saved`) và thêm `StackTabBar` (cùng giao diện Tab Bar, tách từ `GlassTabBar`) để thanh tab vẫn hiện như Figma; chạm một tab sẽ đóng các màn stack và về tab đó. Nút Back dùng `router.back()`.

## 2026-11-02 — Bản đồ thật (SB-016/017)

- Thay ảnh tĩnh bằng **Apple Maps** (`react-native-maps` 1.29, chạy trong Expo Go): `mutedStandard`, tắt POI/la bàn/thang tỷ lệ, khóa giao diện sáng, `mapPadding` để logo Apple và tâm bản đồ nằm trên sheet + tab bar; nền tạm #F4EFE6 và ghim chỉ hiện sau `onMapReady`.
- Ghim giá (màu/kích thước theo Figma: brand900, chọn = Rescue Price) thêm đuôi nhỏ, 2 lớp bóng, số `tabular-nums`, scale-in so le, spring khi chọn; gom cụm theo mức zoom (tự viết, chạm cụm → zoom); chấm người dùng kiểu Apple có quầng sóng (tọa độ demo, không xin quyền vị trí).
- `DetentSheet`: bottom sheet 3 nấc kéo theo ngón tay, snap bằng spring theo vận tốc, rubber-band, grabber 36×5; chọn ghim → sheet về nấc đầu và bản đồ dịch tâm. Nhóm nút kính dọc (Vị trí của tôi, Kiểu bản đồ). Chip "Lọc" nối SB-023.
- Tọa độ cửa hàng là **dữ liệu demo** (`src/data/mock/mapPins.ts`). Đã cập nhật CLAUDE.md và docs/07, docs/11.

## 2026-11-02 — Làm lại tab Tủ thực phẩm theo Figma (SB-074 → SB-090)

Đối chiếu từng frame bằng `get_design_context` / `get_metadata` (số đo thật) và sửa các chỗ lệch:
- **SB-075:** tiêu đề SemiBold 26/38 (trước đây Bold 30); nút "Thêm món" radius 14; hero p12 r20, Fraunces 20/26, đếm 13/20 màu cam, Mầm 64 (trước 80); nút lọc là Apple27 pop-up (SF Pro 13 Semibold) **và có menu kính 238 rộng** (Hạn dùng: Tất cả/Sắp hạn/Còn hạn/Quá hạn/Chưa rõ tại (20,268); Nơi cất tại (135,268)); nút "…" mở **menu kính "Lịch sử tủ thực phẩm / Dữ liệu trên máy" tại (135,115)** đúng Figma (trước là ActionSheet). Component mới `GlassMenu`.
- **SB-076:** dựng lại: thẻ 196 r28 có 2 đường kệ + Mầm **Hello** 128 (asset mới), 2 ô nhóm (Sữa & trứng, Rau & củ) 170×112, dòng chú thích cuối; tiêu đề Bold 26 không có nút "Thêm món".
- **SB-077/082:** icon Pantry 28, tiêu đề 20/28, lựa chọn nơi cất/số lượng 112×52 radius 14 gap 8, nhãn "Nơi bảo quản" 15 Medium. **SB-078:** sheet nền trắng, lưới 168×112 r14 (gap 16/12), tiêu đề 20 Bold. **SB-080/081:** số đo dòng 44/52, tile 104, ngày hạn 28/32, pill 107×32.
- **SB-083/084/086/087/088/089:** khoảng cách khối theo metadata (gap 20, hàng 72/80), banner pad 16, lựa chọn lý do dùng nền forest + dấu tích khi chọn, thẻ lịch sử 88 cao.
- **Vị trí nút CTA (dock):** Figma đặt cạnh dưới nút cách vạch home 36–44pt tuỳ màn; trước đây cố định 20 → nút thấp hơn Figma ~16pt. Đã sửa theo từng màn.
- **Luồng Pantry (đã xác nhận):** bấm tab Tủ thực phẩm → SB-074 giới thiệu → "Bắt đầu với tủ của tôi" → SB-076 (tủ trống) → thêm món → SB-075. Tủ mặc định **trống**; dev hub "Nạp 7 món mẫu" để xem SB-075 ngay.
