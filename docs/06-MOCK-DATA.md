# 06 · Mock data

TBD ở Phase 2. Sẽ ghi: tài khoản demo (email/mật khẩu), danh sách merchant/offer khớp chữ-số Figma, đơn ở các trạng thái, vật phẩm Pantry, kịch bản demo đề xuất.

Dữ liệu đã chắc chắn từ Figma: người dùng "Minh Anh", khu "Đà Nẵng · Khu học xá"; offer Bánh mì men tự nhiên 25.000đ (Tiệm Bánh A · 450m, Nhận 17:00–18:00, còn 3), Bánh sừng bò bơ Pháp 30.000đ (còn 2), Cơm gà áp chảo & rau củ 35.000đ (Bếp Xanh Campus · 350m, 17:30–19:00, còn 4), Combo rau củ tươi trong ngày 30.000đ (Quầy Rau C, 16:00–17:30, còn 5), Túi bánh bất ngờ 29.000đ (18:00–19:00).

## Trạng thái hiện tại (Vòng 1)

- Tài khoản demo: `minhanh@example.com` / `savebite` (mật khẩu là placeholder; form luôn prefill như Figma). Email hợp lệ bất kỳ + mật khẩu không rỗng cũng đăng nhập được.
- 3 merchant, 4 offer (SB-015), 2 đơn đã hoàn tất cố định (SB-060: Bánh sừng bò bơ Pháp 17/10, Cơm gà áp chảo & rau củ 14/10), số liệu tác động 3 đơn / 4 món (SB-091).
- Đơn giữ chỗ lưu AsyncStorage (`savebite.reservations`); đơn đầu tiên có vé SB-001 / mã SB-A125 như Figma, đơn sau tăng dần.
- Ngày giả lập "Thứ Hai, 19/10" và khung giờ đã đóng 15:00–16:00 là fixture lấy từ SB-051 (`src/constants/demo.ts`).
