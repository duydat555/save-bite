# 13 · Liquid Glass — khảo sát khả thi (Expo SDK 58)

**Giới hạn của khảo sát:** dev trên Windows, không có iPhone/Expo Go ở phía tôi. Cột "Bằng chứng" là thứ kiểm được từ docs Expo SDK 58, mã nguồn gói trong `node_modules` và việc bundle iOS thành công — **không** phải chạy thật trên máy. Mục "Cần bạn thử" ghi rõ chỗ phải xác nhận trên điện thoại.

| Hạng mục | Gói / phiên bản | Bằng chứng | Chạy trong Expo Go? | Quyết định |
| --- | --- | --- | --- | --- |
| Native tabs (UITabBar thật, Liquid Glass, nhấn giữ-kéo, `minimizeBehavior="onScrollDown"`, `BottomAccessory`) | `expo-router` 58.0.29, `expo-router/native-tabs` | Có trong build + types (`minimizeBehavior`, `NativeTabs.Trigger.Icon sf`, `BottomAccessory`); docs: nền tab bar do hệ thống vẽ trên iOS 26. Bundle iOS OK với `EXPO_PUBLIC_NATIVE_TABS=true` được hỗ trợ trong `_layout.tsx` | **Chưa xác nhận** (docs không nói rõ Expo Go) | Làm sẵn sau cờ `EXPO_PUBLIC_NATIVE_TABS=true`; **mặc định dùng bản tự dựng** vì cần chắc chắn có nhấn-giữ-kéo/lens/squash đúng yêu cầu và vẫn chạy iOS < 26. Không lồng được native tabs với màn stack có Tab Bar (bản đồ, danh mục) → các màn đó vẫn cần `StackTabBar` tự dựng |
| `GlassView` / `GlassContainer` | `expo-glass-effect` 58.0.5 | Cả hai được export; `isLiquidGlassAvailable()` đã dùng trong `GlassSurface` (iOS 26 → kính thật, thấp hơn → fallback `BlurView`) | Có (docs: gói có trong Expo Go, chỉ iOS 26+) | Đã dùng cho nút/thanh kính; sẽ gộp bằng `GlassContainer` khi nhóm nút |
| `@expo/ui` SwiftUI | `@expo/ui` 58.0.26 (đã cài bằng `expo install`) | Có `Host`, `Toggle`, `Menu`, `ContextMenu`, `Picker`, `Button`, `GlassEffectContainer`, `Popover`… trong `@expo/ui/swift-ui`; docs: "Included in Expo Go" | Có theo docs; **chưa chạy thử** | Dự kiến dùng `Toggle` (Figma vẽ "Apple27 native switch" ở SB-085/097) và `Menu`/`ContextMenu` (Figma vẽ menu Apple27) ở bước 3 — chờ bạn duyệt Tab Bar |
| Khúc xạ thật (bẻ cong nội dung phía sau) | — | Không có API công khai trong React Native/Expo | Không | Xấp xỉ: blur + bản sao nội dung phóng đại ×1.2 trong thấu kính + viền chromatic |

## Lựa chọn cuối cho Tab Bar
- **Mặc định: tự dựng** (`src/components/features/GlassTabBar.tsx`, Reanimated + Gesture Handler, mọi chuyển động là worklet): chạm → spring + squash/stretch; **nhấn giữ 180 ms rồi kéo từ bất kỳ điểm nào** → viên chọn nhấc thành thấu kính (×1.2, cao hơn thanh, bóng sâu hơn, viền chromatic, bản sao nội dung phóng đại bên trong), haptic mỗi lần qua ranh giới tab, thả → spring về tab gần nhất rồi mới chuyển màn; cuộn xuống → thanh co còn icon (`tabBarState.ts`), cuộn lên → mở. Reduce Motion: bỏ nhấc/phóng đại/squash; Reduce Transparency: nền đặc.
- **Tùy chọn thử:** `EXPO_PUBLIC_NATIVE_TABS=true npx expo start` → UITabBar native của iOS 26 (cần bạn thử trên máy; nếu chạy tốt và khớp Figma có thể đổi mặc định).
- iOS < 26: `GlassSurface` tự fallback `BlurView`; thấu kính dùng `BlurView`, không crash.

## Cần bạn thử trên iPhone
1. Chạm từng tab (haptic, capsule trượt).
2. Nhấn giữ ~0,2 s trên thanh rồi kéo ngang qua các tab; thả giữa hai tab.
3. Cuộn Khám phá / Đơn của tôi / Tủ thực phẩm / Tài khoản xuống rồi lên.
4. Bật Reduce Motion và Reduce Transparency trong Cài đặt → Trợ năng, mở lại thanh.
5. (Tùy chọn) chạy với `EXPO_PUBLIC_NATIVE_TABS=true` để so sánh bản native.
