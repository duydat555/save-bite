// Demo coordinates around ĐH CNTT & Truyền thông Việt–Hàn, Đà Nẵng. The design labels them "Ghim mẫu" — merchant
// coordinates are NOT real (see the "Vị trí và khoảng cách tham khảo" disclosure).
export const CAMPUS = { latitude: 15.9755, longitude: 108.2528 };
export const USER_SPOT = { latitude: 15.9749, longitude: 108.2523 }; // the blue dot (Figma shows it by the school icon)

export const MAP_PINS = [
  { offerId: 'offer-banh-sung-bo-bo-phap', latitude: 15.9769, longitude: 108.2547 },
  { offerId: 'offer-com-ga-ap-chao', latitude: 15.9761, longitude: 108.2517 },
  { offerId: 'offer-banh-mi-men-tu-nhien', latitude: 15.9747, longitude: 108.2545 },
] as const;

export const INITIAL_DELTA = { latitudeDelta: 0.0075, longitudeDelta: 0.0075 };
