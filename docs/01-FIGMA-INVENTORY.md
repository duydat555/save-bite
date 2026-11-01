# 01 · Figma inventory

Nguồn: Figma `7suZz9C8oL5zV2NMxlsIVI` — page **App · All Screens** (`11:3`). **100 màn hình** (SB-001 → SB-100), tất cả 393×852.
File này sinh bởi `node scripts/gen-inventory.js` từ `scripts/figma-frames.json`; chỉ sửa cột *Trạng thái* bằng tay (script giữ nguyên).

- **screen** = route riêng · **state** = biến thể trạng thái của route khác (cùng component, đổi dữ liệu) · **sheet** = bottom sheet / modal
- Route là **đề xuất** (Expo Router). Trạng thái: `todo / in-progress / done / verified`. **done** = đã dựng + qua tsc/lint, chờ bạn kiểm tra trên iPhone; chuyển **verified** sau khi bạn duyệt.

## 01 · Entry & Discovery (33)

| Mã | Tên | Loại | Route đề xuất | Node | Trạng thái |
|---|---|---|---|---|---|
| SB-001 | Splash · Warm Start | screen | `/` | [76:652](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=76-652) | done |
| SB-002 | Onboarding 1 · Rescue Value | screen | `/(entry)/onboarding (page 1)` | [17:2](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=17-2) | done |
| SB-003 | Onboarding 2 · Tìm món quanh trường | screen | `/(entry)/onboarding (page 2)` | [100:1692](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1692) | done |
| SB-004 | Onboarding 3 · Tủ thực phẩm thông minh | screen | `/(entry)/onboarding (page 3)` | [100:1728](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1728) | done |
| SB-005 | Welcome Gate · Guest or Login | screen | `/(entry)/welcome` | [78:695](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=78-695) | done |
| SB-006 | Đăng ký · Email & Password | screen | `/(entry)/register` | [100:1766](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1766) | done |
| SB-007 | Chờ xác minh email | screen | `/(entry)/verify-email` | [100:1810](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1810) | done |
| SB-008 | Đăng nhập · Email & Password | screen | `/(entry)/login` | [76:678](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=76-678) | done |
| SB-009 | Quên mật khẩu · Email & Keyboard | screen | `/(entry)/forgot-password` | [100:1855](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1855) | done |
| SB-010 | Đã gửi liên kết khôi phục | screen | `/(entry)/forgot-password-sent` | [100:1955](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1955) | done |
| SB-011 | Quyền vị trí · Bán kính quanh trường | screen | `/(entry)/permission-location` | [100:1986](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-1986) | done |
| SB-012 | Quyền thông báo · Nhắc khung giờ | screen | `/(entry)/permission-notifications` | [100:2013](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=100-2013) | done |
| SB-013 | Home Guest · Rescue Market | state | `/(tabs)/index (guest)` | [78:729](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=78-729) | done |
| SB-014 | Home đã đăng nhập · Feed & Active Order | state | `/(tabs)/index (active order)` | [101:1924](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=101-1924) | done |
| SB-015 | Discovery · Rescue Market | screen | `/(tabs)/index` | [17:49](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=17-49) | done |
| SB-016 | Map · Campus Explorer | screen | `/discover/map` | [17:187](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=17-187) | done |
| SB-017 | Xem nhanh pin trên map · Peek Sheet | sheet | `/discover/map (peek sheet)` | [101:2028](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=101-2028) | done |
| SB-018 | Chọn khu vực & campus | screen | `/discover/area` | [101:2075](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=101-2075) | done |
| SB-019 | Search · Active Input & iOS Keyboard | screen | `/discover/search` | [17:282](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=17-282) | done |
| SB-020 | Gợi ý tìm kiếm · Suggestions | state | `/discover/search (suggestions)` | [101:2117](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=101-2117) | done |
| SB-021 | Kết quả tìm kiếm · Active Filter Strip | screen | `/discover/results` | [101:2161](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=101-2161) | done |
| SB-022 | Search No Results · Empty State | state | `/discover/results (no results)` | [80:809](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=80-809) | done |
| SB-023 | Bộ lọc tổng hợp · Multi-criteria Sheet | sheet | `/discover/filters` | [103:2173](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=103-2173) | done |
| SB-024 | Lọc ngân sách · Price Histogram | sheet | `/discover/filter-budget` | [103:2215](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=103-2215) | done |
| SB-025 | Lọc thời gian nhận · Pickup Slots | sheet | `/discover/filter-slots` | [103:2256](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=103-2256) | done |
| SB-026 | Nhu cầu ăn uống & An toàn · Dietary | sheet | `/discover/filter-dietary` | [103:2297](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=103-2297) | done |
| SB-027 | Sắp xếp kết quả · Sort Options | sheet | `/discover/sort` | [103:2334](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=103-2334) | done |
| SB-028 | Danh mục Bữa ăn · Cooked Meals | screen | `/discover/category?cat=meal` | [104:2253](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2253) | done |
| SB-029 | Danh mục Bánh mì & Pastry · Bakery | screen | `/discover/category?cat=bakery` | [104:2329](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2329) | done |
| SB-030 | Danh mục Thực phẩm & Rau củ · Fresh Produce | screen | `/discover/category?cat=produce` | [104:2404](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2404) | done |
| SB-031 | Đang nhận sớm · Urgent Rescues | screen | `/discover/urgent` | [104:2475](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2475) | done |
| SB-032 | Quanh trường · Walking Distance | screen | `/discover/nearby` | [104:2551](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2551) | done |
| SB-033 | Yêu thích & Đã lưu · Saved Items | screen | `/discover/saved` | [104:2627](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=104-2627) | done |

## 02 · Offer & Merchant (17)

| Mã | Tên | Loại | Route đề xuất | Node | Trạng thái |
|---|---|---|---|---|---|
| SB-034 | Offer Detail · Exact Item | screen | `/offer/[id]` | [18:2](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=18-2) | done |
| SB-035 | Thư viện ảnh món ăn · Photo Gallery | screen | `/offer/[id]/gallery` | [106:2630](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2630) | done |
| SB-036 | Thành phần & Cảnh báo Dị ứng · Allergen Sheet | sheet | `/offer/[id]/allergens` | [106:2655](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2655) | done |
| SB-037 | Chất lượng, hạn & Hướng dẫn · Shelf Life | sheet | `/offer/[id]/shelf-life` | [106:2690](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2690) | done |
| SB-038 | Chi tiết cửa hàng · Merchant Profile | screen | `/offer/merchant/[id]` | [106:2725](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2725) | done |
| SB-039 | Đường tới cửa hàng · Walking Map | screen | `/offer/merchant/[id]/directions` | [106:2775](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2775) | done |
| SB-040 | Quy định nhận món tại quầy · Handover Rules | sheet | `/offer/handover-rules` | [106:2817](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=106-2817) | done |
| SB-041 | Offer khác của tiệm · More Offers | screen | `/offer/merchant/[id]/offers` | [109:2765](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2765) | done |
| SB-042 | Đánh giá cửa hàng · Merchant Reviews | screen | `/offer/merchant/[id]/reviews` | [109:2816](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2816) | done |
| SB-043 | Chi tiết đánh giá & Báo cáo | screen | `/offer/merchant/[id]/reviews/[reviewId]` | [109:2853](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2853) | done |
| SB-044 | Túi bất ngờ · Surprise Bag | screen | `/offer/surprise-bag` | [109:2890](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2890) | done |
| SB-045 | Giải thích túi bất ngờ · Explainer Sheet | sheet | `/offer/surprise-bag (explainer)` | [109:2926](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2926) | done |
| SB-046 | Offer Detail · Sold Out | state | `/offer/[id] (sold out)` | [81:844](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=81-844) | done |
| SB-047 | Offer Detail · Pickup Window Closed | state | `/offer/[id] (window closed)` | [81:930](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=81-930) | done |
| SB-048 | Gần đóng cửa · Closing Soon Urgency | state | `/offer/[id] (closing soon)` | [109:2959](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=109-2959) | done |
| SB-049 | Offer Detail · Allergen Conflict | screen | `/offer/[id]/allergen-conflict` | [81:1012](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=81-1012) | done |
| SB-059 | Login Required Sheet · Return To Offer | sheet | `/offer/login-required` | [82:926](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=82-926) | done |

## 03 · Reserve & Orders (23)

| Mã | Tên | Loại | Route đề xuất | Node | Trạng thái |
|---|---|---|---|---|---|
| SB-050 | Quantity Sheet · Stock Limit | sheet | `/reserve/[offerId] (quantity)` | [83:970](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=83-970) | done |
| SB-051 | Reservation · Pickup Slot | screen | `/reserve/[offerId]` | [19:2](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=19-2) | done |
| SB-052 | Pickup Checklist · Readback | screen | `/reserve/order/[id]/checklist` | [90:1408](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=90-1408) | done |
| SB-053 | Order Summary · Unified Receipt | screen | `/reserve/summary` | [19:69](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=19-69) | done |
| SB-054 | Confirm Reservation Sheet | sheet | `/reserve/confirm` | [83:1072](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=83-1072) | done |
| SB-055 | Processing · Idempotency Guard | screen | `/reserve/processing` | [83:1162](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=83-1162) | done |
| SB-056 | Success · Perforated Pickup Pass | screen | `/reserve/success` | [19:140](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=19-140) | done |
| SB-057 | Reservation Failed · Network | screen | `/reserve/failed` | [84:1122](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=84-1122) | done |
| SB-058 | Stock Changed · Recovery | screen | `/reserve/stock-changed` | [84:1167](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=84-1167) | done |
| SB-060 | My Orders · Overview | screen | `/(tabs)/orders` | [84:1217](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=84-1217) | done |
| SB-061 | Pending Orders · Timeline | state | `/(tabs)/orders (Đang chờ nhận)` | [90:1491](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=90-1491) | done |
| SB-062 | Order Detail · Awaiting Pickup | screen | `/reserve/order/[id]` | [84:1290](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=84-1290) | done |
| SB-063 | Pickup Code · Wallet Pass | screen | `/reserve/order/[id]/pass` | [85:1266](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=85-1266) | done |
| SB-064 | Handover Steps · Backup Code | screen | `/reserve/order/[id]/handover` | [91:1487](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=91-1487) | done |
| SB-065 | Directions · Active Order | screen | `/reserve/order/[id]/directions` | [91:1531](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=91-1531) | done |
| SB-066 | Order Ready · READY state | state | `/reserve/order/[id] (ready)` | [91:1652](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=91-1652) | done |
| SB-067 | Pickup Closing Soon · Urgent | state | `/reserve/order/[id] (closing soon)` | [85:1342](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=85-1342) | done |
| SB-068 | Pickup Expired · No-Show Policy | state | `/reserve/order/[id] (expired)` | [92:1593](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=92-1593) | done |
| SB-069 | Incident Report · Pickup Issue | screen | `/reserve/order/[id]/incident` | [92:1642](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=92-1642) | done |
| SB-070 | Xác nhận hủy đơn · Policy & Reason | sheet | `/reserve/order/[id]/cancel` | [112:3206](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=112-3206) | done |
| SB-071 | Hủy đơn thành công · Empty State | screen | `/reserve/order/[id]/cancelled` | [112:3243](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=112-3243) | done |
| SB-072 | Order Completed · Verified Receipt | state | `/reserve/order/[id] (completed)` | [85:1385](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=85-1385) | done |
| SB-073 | Lịch sử đơn trống · Tab Root | state | `/(tabs)/orders (empty)` | [112:3280](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=112-3280) | done |

## 04 · Pantry & Account (27)

| Mã | Tên | Loại | Route đề xuất | Node | Trạng thái |
|---|---|---|---|---|---|
| SB-074 | Giới thiệu Pantry · Onboarding | screen | `/account/pantry/intro` | [117:3032](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3032) | done |
| SB-075 | Smart Pantry · Kitchen Inventory | screen | `/(tabs)/pantry` | [20:2](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=20-2) | done |
| SB-076 | Tủ trống · Quick Add | state | `/(tabs)/pantry (empty)` | [117:3058](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3058) | done |
| SB-077 | Thêm thủ công · Form | screen | `/account/pantry/add` | [117:3124](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3124) | done |
| SB-078 | Chọn loại thực phẩm · Sheet | sheet | `/account/pantry/add/category` | [117:3166](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3166) | done |
| SB-079 | Chọn ngày hạn · Use-By vs Best-Before | sheet | `/account/pantry/add/date` | [117:3213](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3213) | done |
| SB-080 | Xác nhận thêm · Review | screen | `/account/pantry/add/review` | [117:3254](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3254) | done |
| SB-081 | Chi tiết thực phẩm · Ngày hạn & bảo quản | screen | `/account/pantry/[id]` | [117:3286](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3286) | done |
| SB-082 | Sửa thực phẩm · Edit Item | screen | `/account/pantry/edit/[id]` | [117:3320](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3320) | done |
| SB-083 | Cần dùng sớm | screen | `/account/pantry/soon` | [133:3283](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3283) | done |
| SB-084 | Đã quá hạn dùng | screen | `/account/pantry/overdue` | [133:3314](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3314) | done |
| SB-085 | Thiết lập nhắc hạn · Reminder Settings | screen | `/account/pantry/reminder/[id]` | [117:3350](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=117-3350) | done |
| SB-086 | Cập nhật lượng dùng | screen | `/account/pantry/usage/[id]` | [133:3345](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3345) | done |
| SB-087 | Đánh dấu đã bỏ | screen | `/account/pantry/discard/[id]` | [133:3376](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3376) | done |
| SB-088 | Gợi ý từ tủ của bạn | screen | `/account/pantry/suggestions` | [133:3407](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3407) | done |
| SB-089 | Lịch sử tủ thực phẩm | screen | `/account/pantry/history` | [133:3435](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3435) | done |
| SB-090 | Dữ liệu trên máy | screen | `/account/pantry/data` | [133:3463](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3463) | done |
| SB-091 | Profile · Account & Impact Hub | screen | `/(tabs)/account` | [20:109](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=20-109) | done |
| SB-092 | Edit Profile · Monogram | screen | `/account/edit` | [94:1641](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=94-1641) | done |
| SB-093 | Saved Locations · Privacy Note | screen | `/account/areas` | [94:1684](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=94-1684) | done |
| SB-094 | Lưu khu vực | screen | `/account/areas/add` | [133:3491](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3491) | done |
| SB-095 | Thông báo | screen | `/account/notifications` | [133:3522](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3522) | done |
| SB-096 | Thông báo | state | `/account/notifications (empty)` | [133:3550](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3550) | done |
| SB-097 | Tùy chọn thông báo | screen | `/account/notification-settings` | [133:3581](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3581) | done |
| SB-098 | Quyền riêng tư | screen | `/account/privacy` | [133:3609](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3609) | done |
| SB-099 | Trợ giúp | screen | `/account/help` | [133:3637](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=133-3637) | done |
| SB-100 | Personal Impact · Verified Rescue | screen | `/account/impact` | [85:1445](https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=85-1445) | done |

Tổng: 69 screen · 15 state · 16 sheet = 100.
