# 12 · Map audit — mọi vùng bản đồ trong app

Quét bằng grep (`campus-map`, `map-canvas`, `radius-1000`, `require(...)` tới ảnh bản đồ) và đối chiếu từng screenshot trong `assets/figma-reference/`. Frame có vùng bản đồ: **SB-003, 011, 016/017, 032, 039, 065, 094**. Các frame khác (SB-038 trang cửa hàng, SB-034 chi tiết món, SB-062 chi tiết đơn, SB-063 vé) **không** có vùng bản đồ — chỉ có nút/dòng "Vị trí cửa hàng", "Chỉ đường" dẫn tới SB-039 / SB-065.

Cách xử lý cử chỉ ở thẻ nằm trong ScrollView (đã chọn): **chạm một lần để bật tương tác** — lớp phủ trong suốt chặn cử chỉ cho tới khi chạm, nhờ vậy cuộn dọc không bị bản đồ cướp; sau khi bật có thể kéo/pinch/double-tap. Bản đồ ở nơi vuốt ngang (onboarding) và thẻ trang trí: `preview` (không nhận cử chỉ).

| Màn | File | Trước | Sau | Chế độ | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| SB-003 Onboarding 2 | `src/features/onboarding/OnboardingPages.tsx` | tĩnh (`campus-map.png`) | thật | `preview` (không tương tác, pill chú thích là lớp phủ) | xem bảng cuối |
| SB-011 Quyền vị trí | `app/(entry)/permission-location.tsx` | tĩnh (`map-canvas.png`) | thật | `preview` | xem bảng cuối |
| SB-016/017 Bản đồ + peek sheet | `app/discover/map.tsx` | thật (đợt trước) | thật, dùng component dùng chung | `full` | xem bảng cuối |
| SB-032 Quanh trường | `app/discover/nearby.tsx` | tĩnh (`map-canvas.png`) | thật | `card` (chạm để bật tương tác) | xem bảng cuối |
| SB-039 Vị trí cửa hàng | `app/offer/merchant/[id]/directions.tsx` | tĩnh (`campus-map.png`) + pin vẽ tay | thật + `PricePin` "Điểm nhận" + "Chỉ đường" | `full` | xem bảng cuối |
| SB-065 Điểm nhận (đơn) | `app/reserve/order/[id]/directions.tsx` | tĩnh (`campus-map.png`) + pin vẽ tay | thật + `PricePin` "Điểm nhận" + "Chỉ đường" | `full` | xem bảng cuối |
| SB-094 Lưu khu vực | `app/account/areas/add.tsx` | tĩnh (`map-canvas.png` + `radius-1000.png`) | thật + `Circle` bán kính thật (500 m / 1 km / 2 km) | `card` (chạm để bật tương tác) | xem bảng cuối |

Dữ liệu tọa độ dùng chung: `merchant.coord` trong `src/data/mock/merchants.ts` (Tiệm Bánh A, Bếp Xanh Campus, Quầy Rau C — tọa độ demo "Ghim mẫu").

## Kết quả sau khi chuyển (7/7 màn có bản đồ đã dùng `AppMap`)

| Màn | Cách thử | Đối chiếu Figma | Chưa kiểm chứng trên máy |
| --- | --- | --- | --- |
| SB-003 | Splash → Onboarding, vuốt tới trang 2 | Thẻ bản đồ 353 bo `radius.md` + viền; 2 pill "Bánh mì · 25.000đ" / "Bữa ăn · 35.000đ" và nhãn "Chọn món · Xem khung giờ nhận" là lớp phủ giữ nguyên vị trí Figma; bản đồ không nhận cử chỉ nên vuốt trang vẫn mượt | Pill không gắn theo tọa độ (chỉ xem trước) |
| SB-011 | Dev hub → "Quyền vị trí" (hoặc SB-018 → "Dùng vị trí hiện tại") | Thẻ 353×322 r28, ghim tròn brand900 ở giữa, pill "Bạn chủ động chọn khu vực" ở đáy | Ghim giữa là lớp phủ, không phải Marker |
| SB-016/017 | Khám phá → "Bản đồ →" | Đã làm đợt trước (chip, ghim, sheet 3 nấc, nhóm nút kính) | Cử chỉ sheet/bản đồ, cụm ghim |
| SB-032 | Khám phá → vùng khu vực → "Xác nhận khu vực", hoặc dev hub "Quanh trường" | Dải bản đồ 353×124 r20 trên danh sách; **pinch/double-tap zoom luôn hoạt động; chạm 1 lần để bật kéo bằng một ngón** | Cảm giác chạm-để-bật, có chặn cuộn không |
| SB-039 | Chi tiết cửa hàng → "Vị trí cửa hàng", hoặc dev hub | Bản đồ tới y≈540, sheet bắt đầu y=514, pill "Điểm nhận" màu giá + đuôi, pill "Vị trí và khoảng cách tham khảo"; thêm nhóm nút kính (Chỉ đường → Apple Maps, về cửa hàng) — không có trong Figma | Mở Apple Maps; tâm ghim so với Figma |
| SB-065 | Đơn đang chờ → "Chỉ đường tới điểm nhận", hoặc "Chỉ đường" ở màn giữ chỗ | Thẻ cửa hàng nổi trên cùng, pill "Điểm nhận", sheet y=514; cùng nhóm nút như SB-039 | như SB-039 |
| SB-094 | Tài khoản → Khu vực thường dùng → "+ Thêm khu vực" | Thẻ 353×270 r20; **vòng bán kính thật** (`Circle` đứt nét) thay ảnh 152pt, camera giữ vòng ~152pt cho 500 m / 1 km / 2 km; chạm 1 lần để kéo bản đồ | Vòng nhảy về tâm mới sau khi kéo |

Ghi chú bản đồ nhỏ: nút "Chỉ đường" (`openDirections`, `http://maps.apple.com/?daddr=lat,lng&dirflg=w`) chỉ có ở SB-039/065 (nơi Figma có CTA vị trí); thẻ SB-032/094 không có nút. Test tự động: `__tests__/no-static-maps.test.ts` (fail nếu app/src nhắc tới ảnh bản đồ tĩnh hoặc còn file ảnh bản đồ trong `assets/images`).
