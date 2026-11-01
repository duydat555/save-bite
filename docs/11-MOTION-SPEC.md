# 11 · Motion spec

Mọi giá trị lấy từ `src/design-system/motion.ts`. Animation chạy trên UI thread (Reanimated worklets; `Animated` gốc với native driver cho chuyển tab). Haptic bằng `expo-haptics`. **Không animation nào đổi giá trị tĩnh của Figma** — trạng thái nghỉ giống hệt thiết kế.

## Hằng số

| Nhóm       | Giá trị                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `duration` | fast 150 · base 250 · slow 350 ms                                                              |
| `easing`   | standard `bezier(.25,.1,.25,1)` · enter `out(cubic)` · exit `in(cubic)`                        |
| `spring`   | snappy `{damping 20, stiffness 320, mass .7}` · press `{14, 420, .6}` · bounce `{11, 190, .9}` |
| `press`    | scale 0.97 (0.92 cho nút kính tròn), opacity 0.9                                               |
| `stagger`  | step 50 ms · tối đa 8 phần tử · dịch 12 px                                                     |
| `travel`   | tab 10 px · parallax onboarding stage +0.2 / copy −0.1 (× độ lệch trang)                       |

## Reduce Motion (`useReducedMotion`)

Tắt: scale, trượt, parallax, stagger, pill/thumb spring (đổi sang timing 150 ms), burst scale. Giữ: fade đơn giản 150 ms, hiệu ứng đổi màu, skeleton đứng yên. Hệ thống "Giảm độ trong suốt" → `GlassSurface` thành nền đặc.

## Từng animation

| #   | Nơi dùng                                                               | Hiệu ứng                                                                                                                                                                               | Thời lượng / easing                           |
| --- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Tab bar (`GlassTabBar`)                                                | Viên thuốc chọn trượt sang tab mới; icon tab chọn scale 1→1.1; haptic `selectionAsync`                                                                                                 | spring snappy / bounce                        |
| 2   | Nội dung tab (`(tabs)/_layout`)                                        | Cross-fade + cảnh mới nhô lên 10 px                                                                                                                                                    | 250 ms, standard                              |
| 3   | Stack (root)                                                           | Push/pop: slide ngang iOS 350 ms · `(entry)`, `(tabs)`, success: fade · Mã nhận món: modal trượt từ dưới                                                                               | native, 250–350 ms                            |
| 4   | Nhấn (`PressableScale`: Button, GlassButton, card, row, tile, banner…) | Nhấn: scale 0.97 + opacity 0.9; thả: bật lại bằng spring                                                                                                                               | press-in 150 ms timing · release spring press |
| 5   | Splash (SB-001)                                                        | Logo scale 0.88→1 + fade; title/tagline fade + nhích 10 px (trễ 120/240 ms); hạt lá chạy lần lượt (450 ms/pha); caption fade tới 80%; thoát: cả màn fade-out 250 ms rồi màn kế fade-in | 350 ms, enter                                 |
| 6   | Onboarding (SB-002…004)                                                | Parallax stage/copy khi vuốt (copy mờ dần theo độ lệch); chấm trang dài/co mượt, màu nội suy                                                                                           | theo cuộn (UI thread)                         |
| 7   | Khám phá, Đơn của tôi                                                  | Stagger `FadeInDown` 12 px, 50 ms/phần tử, tối đa 8                                                                                                                                    | 250 ms, enter                                 |
| 8   | Khám phá, Đơn của tôi (lúc repo mock tải)                              | Skeleton nhấp nháy opacity 1↔0.55                                                                                                                                                      | 700 ms ×2 lặp, standard                       |
| 9   | Khám phá, Đơn của tôi                                                  | Pull-to-refresh (`RefreshControl`, màu brand900) + haptic nhẹ                                                                                                                          | hệ thống                                      |
| 10  | Segmented "Tất cả / Đang chờ / Đã nhận"                                | Thumb trắng trượt bằng spring                                                                                                                                                          | spring snappy                                 |
| 11  | Checkbox đồng ý (SB-006)                                               | Nền + viền chuyển màu sang brand900, dấu tick fade                                                                                                                                     | 250 ms, standard                              |
| 12  | Xác nhận giữ chỗ (SB-053 → SB-055)                                     | Nút → trạng thái loading (spinner fade-in); lớp phủ "Đang kiểm tra…" fade-in; ≥1,2 s; chặn bấm đúp và vuốt back                                                                        | 250 ms                                        |
| 13  | Vé nhận món (SB-056)                                                   | Haptic `notificationAsync(Success)`; Mầm "Carry" + dấu tick bật lên (spring) ~0,8 s rồi mờ và gỡ; tiêu đề rise-in; Pickup Pass scale 0.94→1 + fade (trễ 220 ms); footer rise-in        | spring bounce / 350 ms                        |
| 14  | Nút kính tròn                                                          | Nhấn scale 0.92                                                                                                                                                                        | như #4                                        |

## Kính (`GlassSurface`)

`variant` circle | pill | bar. iOS 26 → `GlassView` (expo-glass-effect); iOS cũ/không khả dụng → `BlurView` (intensity 40–80, tint light). Luôn thêm: lớp phủ trắng mờ (0.32 khi dùng blur, 0.14 khi dùng kính thật), sheen trắng phía trên, viền 1 px gradient sáng→mờ, highlight mỏng ở mép trên, bóng mềm bên dưới. Dùng cho: nút heart/bell/filter/back/close và Tab Bar nổi.

## Bản đồ (SB-016/017) — `mapMotion` trong `motion.ts`

| Phần tử | Hành vi | Thông số |
| --- | --- | --- |
| Camera (`animateToRegion`, `fitToCoordinates`) | Chọn ghim → dịch tâm để ghim nằm trên vùng không bị sheet che; chạm cụm → zoom vào các ghim trong cụm. Không animate khi người dùng đang kéo/zoom | 450 ms |
| Ghim giá (`PricePin`) | Hiện sau `onMapReady`: scale 0.6→1 + fade + nhích 6 px, so le 40 ms/ghim. Chọn: spring lên ×1.12, nền chuyển brand900 → price (theo Figma), bóng sâu hơn. Hết hàng: opacity 0.5 | timing 280 ms · spring `mapMotion.pin` (damping 22, stiffness 260, mass 1) |
| Chấm người dùng | Quầng xanh nở + mờ dần, lặp | 1800 ms |
| Bottom sheet (`DetentSheet`) | 3 nấc (152 · nửa màn · gần đầy). Kéo theo ngón tay; thả: chiếu vận tốc → snap nấc gần nhất bằng spring; rubber-band ×0.3 quá hai đầu; chỉ cuộn danh sách ở nấc cuối | spring `mapMotion.sheet` (damping 24, stiffness 240, mass 1) |
| Nhóm nút kính | Nhấn scale 0.92 + haptic Light; "Vị trí của tôi" bật → icon `location.fill` + màu brand | như #4 |
| Haptic | `selectionAsync` khi chọn ghim / đổi nấc sheet / chạm cụm; `impactAsync(Light)` khi chạm nút điều khiển | — |
| Reduce Motion | Bỏ scale/bounce/nhích/quầng nhấp nháy, chỉ còn fade; sheet dùng timing 250 ms | — |
