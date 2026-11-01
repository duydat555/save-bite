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
