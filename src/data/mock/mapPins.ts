// Demo coordinates around ĐH CNTT & Truyền thông Việt–Hàn, Đà Nẵng. The design labels them "Ghim mẫu" — merchant
// coordinates are NOT real (see the "Vị trí và khoảng cách tham khảo" disclosure). One merchant = one location on every
// screen (SB-016, 032, 039, 065); `merchant.coord` in merchants.ts reads from MERCHANT_COORDS.
export type LatLng = { latitude: number; longitude: number };

export const CAMPUS: LatLng = { latitude: 15.9755, longitude: 108.2528 };
export const USER_SPOT: LatLng = { latitude: 15.9749, longitude: 108.2523 }; // the blue dot (Figma: by the school icon)

export const MERCHANT_COORDS: Record<string, LatLng> = {
  'merchant-tiem-banh-a': { latitude: 15.9747, longitude: 108.2545 },
  'merchant-bep-xanh-campus': { latitude: 15.9761, longitude: 108.2517 },
  'merchant-quay-rau-c': { latitude: 15.9769, longitude: 108.2547 },
};

// SB-016 shows one price pin per offer ("Bản đồ · 3"). Tiệm Bánh A has two offers: the second pin is nudged ~55 m north
// so the two pills do not overlap; the pickup point itself (SB-039 / SB-065) uses the exact merchant coordinate.
export const MAP_PINS = [
  { offerId: 'offer-banh-mi-men-tu-nhien', merchantId: 'merchant-tiem-banh-a', nudge: 0 },
  { offerId: 'offer-banh-sung-bo-bo-phap', merchantId: 'merchant-tiem-banh-a', nudge: 0.0005 },
  { offerId: 'offer-com-ga-ap-chao', merchantId: 'merchant-bep-xanh-campus', nudge: 0 },
].map((p) => ({
  offerId: p.offerId,
  latitude: MERCHANT_COORDS[p.merchantId].latitude + p.nudge,
  longitude: MERCHANT_COORDS[p.merchantId].longitude,
}));

export const INITIAL_DELTA = { latitudeDelta: 0.0075, longitudeDelta: 0.0075 };
