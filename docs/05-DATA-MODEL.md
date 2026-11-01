# 05 · Data model (nháp)

Chỉ gồm những gì đã thấy trong Figma (SB-015, SB-056, Components). Hoàn thiện khi dựng từng màn.

| Entity              | Trường chính                                                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User                | id, email, displayName ("Minh Anh"), area ("Đà Nẵng · Khu học xá"), savedLocations[], notificationPrefs                                                                                               |
| Merchant            | id, name ("Tiệm Bánh A", "Bếp Xanh Campus", "Quầy Rau C"), distanceM, address, rating, pickupPoint ("Điểm nhận A · ĐH Đà Nẵng · 450m")                                                                |
| Offer               | id, merchantId, title, category (bakery/meal/produce/surprise), photo, priceVnd, remaining, pickupStart, pickupEnd, allergens[], shelfLife, status (available/soldOut/windowClosed/closingSoon)       |
| Reservation (Order) | id, offerId, quantity, slot, status, code, createdAt. Thanh toán luôn "tại quầy"                                                                                                                      |
| PantryItem          | id, name, category (Bakery, MilkEggs, Produce, Fruit, Prepared, MeatFish, Spices, Other), quantity, expiryDate, expiryKind (use-by / best-before), freshness (safe >3 ngày / soon 1–2 ngày / overdue) |
| Review              | id, merchantId, rating, text                                                                                                                                                                          |

Trạng thái Reservation (suy từ SB-051…072): `pending → ready → completed`, cùng `cancelled`, `expired`, `failed`. **Cần xác nhận** khi đọc từng màn đơn.

Fixture khớp Figma (SB-015):

```json
{
  "id": "offer-bread-01",
  "merchant": "Tiệm Bánh A",
  "distanceM": 450,
  "title": "Bánh mì men tự nhiên",
  "priceVnd": 25000,
  "remaining": 3,
  "pickup": "17:00–18:00"
}
```

Định dạng: tiền `25.000đ`, giờ `17:00–18:00` (dùng gạch ngang en dash `–`).
