# 07 · Architecture

- **Expo SDK 58 + TypeScript**, chỉ module có trong Expo Go.
- **Expo Router** (file-based) thay vì React Navigation: route = file, deep link & typed routes sẵn, modal/formSheet gọn cho ~19 bottom sheet. Routes ở `app/`; code còn lại ở `src/` (alias `@/*`).
- State: Zustand (store nhỏ cho session, giỏ/đơn, bộ lọc). Dữ liệu: `services → repositories → mock` (async + delay 200–500ms).
- Animation: reanimated 4 + gesture-handler. Font: `@expo-google-fonts/be-vietnam-pro`.
- Lưu local: AsyncStorage.

## Thêm màn hình mới

1. Tra `01-FIGMA-INVENTORY.md` → route. 2. Tạo file trong `app/`. 3. Dựng bằng component `src/components/ui` + tokens. 4. Cập nhật inventory/checklist/changelog.

## Quyết định đã được duyệt (2026-11-01)

- **Liquid Glass** (nút tròn heart/bell/filter, Tab Bar): xấp xỉ bằng `expo-blur` `BlurView` + nền trắng mờ + viền trắng mờ + shadow nhẹ (`glass` trong tokens, `GlassButton`, `GlassTabBar`). Không giống 100% native.
- **Bản đồ**: màn SB-016/017 dùng **Apple Maps thật** (`react-native-maps`, có trong Expo Go); ghim/cluster/bottom sheet tự dựng. Các màn khác (onboarding, SB-040/065) vẫn dùng ảnh tĩnh Figma.
- **Thêm `app/discover/`** cho các màn khám phá ngoài tab (map, tìm kiếm, kết quả, lọc, danh mục, bộ sưu tập, đã lưu, chọn khu vực). Tab `(tabs)` vẫn giữ 4 tab theo BottomNav.
- Heading dùng Be Vietnam Pro như Figma (bỏ yêu cầu serif trong brief ban đầu).
- Tab bar tự dựng (`expo-router/js-tabs` + prop `tabBar`); API mới của expo-router 58: `emitter`, `navigateToTab`, `insets` (không còn `navigation`).
- Icon: Phosphor/brand xuất SVG từ Figma → `scripts/gen-svg.js` sinh `src/design-system/icons/svg-data.ts` → `SvgIcon` (`SvgXml`). Icon hệ thống iOS (heart, bell, tab…) dùng SF Symbols qua `expo-symbols` (chạy trong Expo Go).
- TypeScript 6 không tự nạp `@types/*`: `tsconfig.json` khai báo `"types": ["jest"]`.

## Kính & chuyển động (2026-11-01)

- **`src/components/ui/GlassSurface.tsx`** — nguồn duy nhất cho mọi bề mặt Liquid Glass (`variant`: circle | pill | bar; `intensity`, `tint`, `overlay`, `interactive`). Tự chọn `GlassView` (`expo-glass-effect`, có trong Expo Go SDK 58, chỉ iOS 26+) hoặc fallback `BlurView`; luôn vẽ thêm lớp phủ, sheen, viền gradient 1 px, highlight, bóng. Tôn trọng "Giảm độ trong suốt". `GlassButton` và `GlassTabBar` dùng nó.
- **`src/design-system/motion.ts`** — hằng số duration/easing/spring/press/stagger/travel; mọi animation phải lấy từ đây. Chi tiết từng animation: `docs/11-MOTION-SPEC.md`.
- **`PressableScale`** — Pressable có phản hồi nhấn (scale + opacity, spring khi thả). Dùng cho mọi phần tử bấm được.
- **`useStaggerEntering`** (`src/hooks/useEntering.ts`) — entering FadeInDown có stagger, tự giảm còn fade khi Reduce Motion.
- **`Skeleton`** — placeholder khi repository mock tải.
- Tab: `(tabs)/_layout` dùng `sceneStyleInterpolator` + `transitionSpec` tự viết; Stack gốc cấu hình `animation` theo nhóm route (xem `app/_layout.tsx`).
- Giới hạn: nút kính trên `BrandHeader`/`AppBar` nằm trên nền kem đặc theo Figma nên hiệu ứng kính hầu như phẳng ở đó; thấy rõ nhất ở Tab Bar (nội dung cuộn phía sau) và nút trên ảnh hero của SB-034.
