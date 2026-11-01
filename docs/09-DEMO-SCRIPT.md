# 09 · Demo script (3–5 phút)

## Đặt lại trước khi demo (30 giây)

1. Chạy `npx expo start` (hoặc `EXPO_PUBLIC_DEMO_MODE=true npx expo start`), mở app trong Expo Go.
2. Mở dev hub bằng **một trong 3 cách** (chi tiết ở `docs/10-RUN-ON-WINDOWS-EXPO-GO.md`):
   - giữ chữ "SaveBite" ở Splash 1,2 giây;
   - ở tab Tài khoản chạm 5 lần vào tiêu đề "Tài khoản" (hoặc giữ thẻ hồ sơ 1,5 giây);
   - mở `exp://<IP>:8081/--/dev` (deep link).
3. Bấm nút đỏ **"Đặt lại TOÀN BỘ dữ liệu demo"** → xác nhận **Đặt lại**. App quay về Splash như lần đầu (không còn đăng nhập, đơn, tủ thực phẩm, mục đã lưu cũ).

## Kịch bản

Splash → Onboarding → Welcome → Đăng nhập (tài khoản demo `minhanh@example.com` / `savebite`) → Khám phá → Chi tiết món → Chọn số lượng → Giữ chỗ → Xác nhận → Đang xử lý → Thành công → Đơn của tôi → Mã nhận → Tủ thực phẩm → Tài khoản.

Các trạng thái phụ (hết phần, ngoài giờ, lỗi mạng, đơn hết hạn…) bật từ dev hub trước khi vào màn tương ứng.
