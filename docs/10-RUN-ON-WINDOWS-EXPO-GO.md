# 10 · Chạy trên Windows với Expo Go (iPhone)

1. Cài Node LTS (đã có v24), cài **Expo Go** từ App Store và cập nhật bản mới nhất (dự án dùng SDK 58).
2. Trong thư mục dự án: `npm install` rồi `npx expo start`.
3. Quét QR bằng app Camera của iPhone → mở trong Expo Go. iPhone và máy tính phải **cùng Wi-Fi**.

## Lỗi thường gặp

| Triệu chứng                  | Cách xử lý                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Không kết nối được / timeout | `npx expo start --tunnel` (có thể hỏi cài `@expo/ngrok`)                                                                       |
| Vẫn không thấy               | Windows Firewall: cho phép Node.js trên mạng Private; tắt VPN; tránh Wi-Fi trường chặn thiết bị khác (dùng hotspot điện thoại) |
| Giao diện/đồ cũ              | `npx expo start -c` (xoá cache Metro)                                                                                          |
| Báo SDK không tương thích    | Cập nhật Expo Go trên iPhone                                                                                                   |
| Lỗi package sau khi cài      | `npx expo install --fix` và `npx expo-doctor`                                                                                  |

## Mở dev hub / đặt lại dữ liệu demo

Dev hub (lối tắt từng màn + nút **Đặt lại TOÀN BỘ dữ liệu demo**) chỉ có khi chạy `npx expo start` (`__DEV__`) hoặc khi đặt `EXPO_PUBLIC_DEMO_MODE=true` (ví dụ `EXPO_PUBLIC_DEMO_MODE=true npx expo start`). Bản hoàn chỉnh không có các lối vào này. Có 3 cách mở:

1. **Splash:** chạm và **giữ** chữ "SaveBite" 1,2 giây. Chạm vào là splash dừng đếm; thả sớm thì tiếp tục và chuyển màn như cũ.
2. **Tab Tài khoản:** chạm **5 lần liên tiếp** (trong 1,5 giây mỗi lần) vào tiêu đề "Tài khoản", hoặc **giữ 1,5 giây** vào thẻ hồ sơ.
3. **Deep link:** `savebite://dev` (bản build riêng) hoặc, khi chạy Expo Go, `exp://<IP-máy-tính>:8081/--/dev`. Gõ vào Safari trên iPhone hoặc `npx uri-scheme open "exp://<IP>:8081/--/dev" --ios`.
