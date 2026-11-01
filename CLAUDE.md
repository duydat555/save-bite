@AGENTS.md

# SaveBite V2 — context for agents

App giải cứu thực phẩm cuối ngày (giữ chỗ món còn dư, nhận & thanh toán tại quầy). Demo cho môn Thiết kế UI/UX.
Chạy bằng **Expo Go trên iPhone thật**, dev trên **Windows** (không Mac/Xcode). Dữ liệu mock, không backend.

## Source of truth

- Figma: https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=11-3 (fileKey `7suZz9C8oL5zV2NMxlsIVI`)
- Pages: `Foundations`, `Components`, `App · All Screens` (groups 01 Entry & Discovery, 02 Offer & Merchant, 03 Reserve & Orders, 04 Pantry & Account). Frames named `SB-xxx · Tên`.
- **Figma luôn đúng.** Không tự "cải tiến" màu/font/spacing. Nếu Expo Go không làm được một chi tiết → ghi rõ giới hạn, đề xuất phương án gần nhất, hỏi user trước khi đổi.

## Read at the start of every session

1. `docs/CHANGELOG.md` (làm tới đâu)
2. `docs/01-FIGMA-INVENTORY.md` (trạng thái từng màn)
3. `docs/02-DESIGN-TOKENS.md` + `src/design-system/tokens/` (phải khớp 1-1)
4. `docs/03-COMPONENT-SPEC.md`, `docs/04-NAVIGATION-FLOW.md` khi làm màn mới

## Commands (Windows)

```bash
npx expo start            # quét QR bằng Expo Go
npx expo start --tunnel   # khi LAN không thông
npx expo start -c         # xoá cache Metro
npx tsc --noEmit          # typecheck
npx expo lint             # ESLint + Prettier
npx expo-doctor           # kiểm tra dependency
npx expo install <pkg>    # LUÔN dùng cho gói Expo/RN
```

## Hard constraints

- Expo SDK 58, chỉ thư viện có sẵn trong Expo Go. Cấm `expo prebuild`, dev client, native module tùy chỉnh.
- Routing: Expo Router, routes ở `app/` (root). Code không phải route nằm trong `src/`. Có thêm `app/discover/` cho các màn khám phá ngoài tab (map, search, filters, category, saved…).
- Liquid Glass → `expo-blur` (BlurView + viền trắng mờ + shadow nhẹ). Bản đồ (SB-016/017) → **Apple Maps thật qua `react-native-maps`** (chạy trong Expo Go; yêu cầu mới của chủ dự án, thay cho ảnh tĩnh). Không còn ảnh bản đồ tĩnh nào (xem docs/12-MAP-AUDIT.md).
- Kính: dùng `GlassSurface` (GlassView iOS 26 / fallback BlurView). Chuyển động: mọi giá trị lấy từ `src/design-system/motion.ts`, tôn trọng Reduce Motion, không animate layout trên JS thread (xem `docs/11-MOTION-SPEC.md`).
- Font: Be Vietnam Pro (UI), **Fraunces Bold (serif) cho tiêu đề editorial onboarding/xác minh email**, JetBrains Mono (mã nhận). Tab bar tự dựng: `expo-router/js-tabs`.
- **Vòng 1 chỉ gồm luồng demo chính.** Không làm sheet, màn trạng thái, Pantry khi user chưa duyệt Vòng 1. Trước khi dựng mỗi màn: tải screenshot Figma vào `assets/figma-reference/`. Chỗ không chắc về prototype → liệt kê hỏi user, không tự đoán.
- Import alias: `@/*` → `src/*`, `@assets/*` → `assets/*`.
- Không hard-code màu/size/font ngoài `src/design-system/tokens` (trừ khi Figma dùng giá trị lẻ — khi đó ghi chú `// figma: <node-id>`).
- Chuỗi UI tiếng Việt giữ nguyên như Figma; code/tên file tiếng Anh.
- Safe area: dùng `react-native-safe-area-context`; frame gốc ~393×852, co giãn bằng flex.
- UI chỉ đọc dữ liệu qua `src/services` → `src/data/repositories` (async + delay 200–500ms), không import mock trực tiếp.

## Per-screen definition of done

- [ ] Lấy `get_design_context` + screenshot (lưu `assets/figma-reference/SB-xxx.png`)
- [ ] Dựng bằng component/token dùng chung; khớp size, padding, gap, radius, shadow, màu, font, line-height, ảnh, icon
- [ ] Đủ trạng thái có trong Figma (default/pressed/disabled/error/loading/empty)
- [ ] Điều hướng đúng prototype
- [ ] `tsc` + `expo lint` sạch
- [ ] Cập nhật `01-FIGMA-INVENTORY.md`, `08-FIGMA-FIDELITY-CHECKLIST.md`, `CHANGELOG.md`
