# 04 · Navigation flow

> **Bản nháp suy ra từ tên frame và SB-015.** Chưa đọc được prototype reactions (dây nối) từ Figma MCP read-only. Sẽ đối chiếu lại với prototype thật ở Phase 3, mỗi màn. Route cụ thể xem `01-FIGMA-INVENTORY.md`.

Thư viện: **Expo Router** (file-based). Tab chính 4 tab theo BottomNav: Khám phá · Đơn của tôi · Tủ thực phẩm · Tài khoản.

```mermaid
flowchart TD
  SB001[SB-001 Splash] --> CHK{Đã đăng nhập / xem onboarding?}
  CHK -- lần đầu --> OB[SB-002..004 Onboarding 3 trang]
  OB --> WG[SB-005 Welcome Gate]
  CHK -- chưa đăng nhập --> WG
  CHK -- đã đăng nhập --> HOME
  WG -- Khách --> PERM[SB-011 Vị trí → SB-012 Thông báo]
  WG -- Đăng nhập --> LOGIN[SB-008 Đăng nhập]
  WG -- Đăng ký --> REG[SB-006 Đăng ký] --> VER[SB-007 Chờ xác minh email] --> PERM
  LOGIN --> HOME
  LOGIN -- Quên mật khẩu --> FP[SB-009] --> FPS[SB-010 Đã gửi liên kết] --> LOGIN
  PERM --> HOME[(tabs)/index: SB-013 khách / SB-014 / SB-015]

  HOME -->|Bản đồ →| MAP[SB-016 Map] --> PEEK[SB-017 Peek sheet] --> OFFER
  HOME -->|ô tìm kiếm| SRCH[SB-019 → SB-020 → SB-021 Kết quả] --> OFFER
  SRCH --> NORES[SB-022 Không có kết quả]
  HOME -->|nút lọc| FLT[SB-023 Bộ lọc] --> SUB[SB-024..027 Ngân sách / Giờ nhận / Dị ứng / Sắp xếp]
  HOME -->|category| CAT[SB-028..030] --> OFFER
  HOME -->|banner / bộ sưu tập| COL[SB-031 Nhận sớm, SB-032 Quanh trường] --> OFFER
  HOME -->|tim| SAVED[SB-033 Đã lưu]
  HOME -->|khu vực ▾| AREA[SB-018 Chọn khu vực]
  HOME -->|banner Túi bất ngờ| SURP[SB-044 → SB-045]

  HOME -->|card| OFFER[SB-034 Offer Detail]
  OFFER --> GAL[SB-035 Ảnh] & ALG[SB-036 Dị ứng] & SHELF[SB-037 Hạn dùng] & MER[SB-038 Cửa hàng]
  MER --> DIR[SB-039] & MORE[SB-041] & REV[SB-042 → SB-043]
  OFFER -.trạng thái.-> ST[SB-046 hết hàng · SB-047 hết giờ · SB-048 sắp đóng · SB-049 xung đột dị ứng]
  OFFER -- Khách bấm giữ chỗ --> LR[SB-059 Cần đăng nhập] --> LOGIN
  OFFER -- Giữ chỗ --> RES[SB-051 Chọn khung giờ] --> QTY[SB-050 Số lượng] --> SUM[SB-053 Tóm tắt] --> CONF[SB-054 Xác nhận] --> PROC[SB-055 Đang xử lý]
  PROC -- ok --> OK[SB-056 Thành công · Pickup Pass]
  PROC -- lỗi mạng --> FAIL[SB-057] --> SUM
  PROC -- hết hàng --> SC[SB-058 Stock changed] --> OFFER
  OK --> ORD

  ORD[(tabs)/orders: SB-060 / SB-061 / SB-073 trống] --> OD[SB-062 Chi tiết đơn]
  OD --> PASS[SB-063 Mã nhận] & CHK2[SB-052 Checklist] & HS[SB-064 Các bước] & DIR2[SB-065 Chỉ đường]
  OD -.trạng thái.-> OS[SB-066 READY · SB-067 sắp hết · SB-068 hết hạn · SB-072 hoàn tất]
  OD --> CANCEL[SB-070 Xác nhận hủy] --> CD[SB-071 Đã hủy] --> ORD
  OS --> INC[SB-069 Báo sự cố]

  HOME ~~~ PANTRY[(tabs)/pantry: SB-075 / SB-076 trống]
  PANTRY --> INTRO[SB-074 Giới thiệu] & ADD[SB-077 Thêm thủ công → SB-078 → SB-079 → SB-080] & PD[SB-081 Chi tiết → SB-082 Sửa, SB-086, SB-087]
  PANTRY --> SOON[SB-083] & EXP[SB-084] & SUGG[SB-088] & HIST[SB-089] & REM[SB-085]

  ACC[(tabs)/account: SB-091] --> EP[SB-092] & LOC[SB-093 → SB-094] & NOTI[SB-095/096 → SB-097] & PRIV[SB-098] & HELP[SB-099] & LD[SB-090] & IMP[SB-100 Tác động]
```

## Quy tắc chuyển màn (dự kiến)

- Sau Splash: dựa trên cờ `hasSeenOnboarding` + phiên đăng nhập trong AsyncStorage.
- Khách (SB-013) xem được feed; mọi hành động giữ chỗ chuyển SB-059 rồi quay lại đúng offer sau đăng nhập.
- Sheet/modal (SB-017, 018, 023–027, 036, 037, 040, 045, 050, 054, 059, 070, 078, 079, 086, 087) dùng `presentation: 'transparentModal' | 'formSheet'` của Expo Router.
- Tab bar ẩn ở các màn nhập liệu/đặt chỗ (reserve/*, đăng nhập…).

## Điểm chưa chắc — cần bạn xác nhận (không đọc được prototype qua MCP)

Vòng 1 đang dùng các giả định sau; **chưa có trong Figma** hoặc chưa kiểm chứng được:

1. **Splash (SB-001):** thời gian hiển thị (đang 1,8 s) và điểm đến: lần đầu → Onboarding; đã xem Onboarding → Welcome; đã đăng nhập/khách → tab chính.
2. **Onboarding:** "Bỏ qua" và "Bắt đầu sử dụng" đều → Welcome (SB-005). Có cho vuốt ngược không?
3. **Welcome → "Khám phá món gần bạn":** vào tab Khám phá dạng khách. SB-013 (Home khách) chưa đọc nên dùng chung SB-015 với lời chào "Chào bạn".
4. **Sau Đăng nhập / Xác minh email:** đang vào thẳng tab chính. Prototype có đi qua quyền vị trí (SB-011) / thông báo (SB-012) không?
5. **Đăng ký → SB-007:** "Tôi đã xác minh" → tab chính; "Đổi địa chỉ email" → quay lại. "Quên mật khẩu?" chưa nối (SB-009 chưa dựng).
6. **SB-034 → "Chọn số lượng":** đang đi thẳng SB-051 (số lượng cố định 1). Prototype có mở sheet SB-050 trước không?
7. **SB-053 → "Xác nhận giữ chỗ":** đang tạo đơn rồi sang SB-056. Prototype có qua SB-054 (xác nhận) và SB-055 (đang xử lý) không?
8. **SB-056:** "Xem đơn của tôi" và nút đóng (X) → tab Đơn của tôi; "Chỉ đường" (SB-065) chưa nối.
9. **SB-060 / SB-062 / SB-063:** thẻ đơn → SB-062; "Mở mã QR nhận món" và "Xem mã nhận món" → SB-063. SB-063 có "DemoHotspot · staff scans → SB-072" (hoàn tất đơn) — chưa dựng.
10. **Tab "Tủ thực phẩm"** vẫn placeholder (Pantry thuộc Vòng sau). Các hàng trong SB-091 chưa nối màn con.
11. **Tài khoản demo:** email `minhanh@example.com` (lấy từ Figma); mật khẩu Figma chỉ hiện 8 dấu chấm → placeholder `savebite`.

## Quyết định đã chốt (2026-11-01)

1. Splash 1,8 s — giữ nguyên.
2. Sau đăng nhập / xác minh email → thẳng tab chính, bỏ qua quyền vị trí/thông báo (SB-011/012).
3. "Chọn số lượng" → thẳng SB-051 (số lượng cố định 1); chưa làm sheet SB-050.
4. "Xác nhận giữ chỗ" → trạng thái **đang xử lý** (SB-055, đã đọc: lớp phủ "ProcessingVeil" trên chính màn biên lai, spinner, nút loading, ≥1,2 s) → SB-056. Bỏ qua SB-054. SB-055 có hai DemoHotspot (057 offline, 058 hết hàng) — chưa làm.
5. Khách dùng chung SB-015 như hiện tại.
6. Vùng ẩn "staff scans → SB-072" ở SB-063: chưa làm.

## Cập nhật 2026-11-01 — nhóm 04 (Pantry & Account)

Đã chốt theo yêu cầu: giữ sheet SB-050; giữ cố định "15 phút" và "17:24, 19/10"; "Xem tác động của bạn" (SB-072) → SB-100.

**SB-064 (Đưa mã cho cửa hàng): chưa rõ nguồn vào.** Đã tìm trong metadata SB-063/065/066/064 — không có liên kết dẫn tới SB-064. Màn đã dựng, chỉ mở được từ dev hub ("Mở SB-064 cho đơn mới nhất"). Cần bạn chỉ nút nào trong Figma dẫn tới nó.

Đã nối:
- Account (SB-091): hồ sơ + "Chỉnh sửa" → SB-092; thẻ tác động → SB-100; "Khu vực thường dùng" → SB-093 → "+ Thêm khu vực" → SB-094; "Nhắc lịch & ngày hạn" → SB-097; "Quyền riêng tư & dữ liệu" → SB-098; "Trợ giúp nhận món" → SB-099 → "Báo sự cố nhận món" → SB-069.
- Pantry: "Dùng" → SB-086; "Bỏ" (món quá hạn) → SB-087; chi tiết SB-081: "Sửa" → SB-082, "Nhắc hạn" → SB-085, "Đánh dấu đã dùng" → SB-086, "Đánh dấu đã bỏ" → SB-087; "Gợi ý dùng món" (SB-083) → SB-088; "Đánh dấu đã bỏ" (SB-084) → SB-087; SB-072 "Xem tác động của bạn" → SB-100.

**Chưa rõ nguồn vào (chỉ mở từ dev hub) — cần bạn xác nhận:**
1. SB-074 Giới thiệu Pantry — hiện nút "Bắt đầu với tủ của tôi" → tab Tủ thực phẩm. Hiện ra lần đầu mở tab? hay từ chỗ khác?
2. SB-083 Cần dùng sớm và SB-084 Đã quá hạn dùng — từ đâu vào (banner? hàng "Sắp hạn"/"Quá hạn" trong SB-075)?
3. SB-095/096 Thông báo — chuông ở đâu (Khám phá?). SB-096 là trạng thái trống (dev hub "Xóa thông báo").
4. Menu "…" của tab Tủ thực phẩm không vẽ trong Figma → tạm dùng ActionSheet (Lịch sử tủ thực phẩm / Dữ liệu trên máy).
5. SB-086 và SB-087 trong Figma là **màn đầy đủ** (có AppBar), không phải sheet như tên gọi trong danh mục cũ.
6. Dòng "Đã lưu" và "Dị ứng & an toàn" ở SB-091, các câu hỏi trong SB-099 và các hàng thông báo: chưa có màn đích → chưa nối.
