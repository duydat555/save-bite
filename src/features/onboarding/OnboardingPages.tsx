import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { OfferCard } from '@/components/features/OfferCard';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { AppMap } from '@/components/features/MapView';
import { Text } from '@/components/ui/Text';
import { CAMPUS } from '@/data/mock/mapPins';
import { colors, radius } from '@/design-system/tokens';

// Figma: SB-002 / SB-003 / SB-004. Stage = 353×340 at x=20,y=115; copy block = 353×192 at y=476.
const STAGE_HEIGHT = 340;

/* ---------- SB-002 · Onboarding 1 · Rescue Value ---------- */
function RescueStage() {
  return (
    <View style={[styles.stage, { backgroundColor: colors.brand100, borderRadius: 28 }]}>
      <View style={styles.ellipse} />
      <View style={styles.veggieFrame}>
        <Image
          source={require('@assets/images/onboarding/veggies.jpg')}
          contentFit="cover"
          style={StyleSheet.absoluteFill}
        />
      </View>
      <OfferCard
        style={styles.stageCard}
        image={require('@assets/images/offers/bread-sourdough.jpg')}
        stockLabel="Còn 3 phần"
        merchantLine="Tiệm Bánh A · 450m"
        title="Bánh mì men tự nhiên"
        pickupLabel="Nhận 17:00–18:00"
        priceLabel="25.000đ"
      />
      <View style={styles.reservePill}>
        <Text variant="eyebrow" color="textInverse">
          Giữ chỗ trước · Trả tại quầy 25.000đ
        </Text>
      </View>
    </View>
  );
}

/* ---------- SB-003 · Onboarding 2 · Tìm món quanh trường ---------- */
function MapStage() {
  return (
    <View
      style={[
        styles.stage,
        { backgroundColor: colors.surfaceSubtle, borderRadius: radius.md },
        styles.mapBorder,
      ]}
    >
      {/* real map, no gestures: the pager keeps its own horizontal swipes (docs/12-MAP-AUDIT.md) */}
      <AppMap
        mode="preview"
        region={{ ...CAMPUS, latitudeDelta: 0.0075, longitudeDelta: 0.0075 }}
        style={styles.mapImage}
      />
      <View style={[styles.pin, styles.pinPrimary]}>
        <Text variant="pinTitleBold" color="white">
          Bánh mì · 25.000đ
        </Text>
        <Text variant="pinMeta" color="textInverse">
          17:00–18:00
        </Text>
      </View>
      <View style={[styles.pin, styles.pinSecondary]}>
        <Text variant="pinTitleSemi">Bữa ăn · 35.000đ</Text>
        <Text variant="pinMeta" color="textSecondary">
          17:30–19:00
        </Text>
      </View>
      <View style={styles.windowBadge}>
        {/* figma: text box is 171 wide, so it wraps to two lines inside the 32pt badge — kept as designed */}
        <Text variant="pinMeta" color="brand900" style={{ width: 171, lineHeight: 18 }}>
          Chọn món · Xem khung giờ nhận
        </Text>
      </View>
    </View>
  );
}

/* ---------- SB-004 · Onboarding 3 · Tủ thực phẩm thông minh ---------- */
function PantryStage() {
  return (
    <View style={[styles.stage, { backgroundColor: colors.wheatLight, borderRadius: 28 }]}>
      <View style={styles.mam}>
        <SvgIcon name="mam-kitchen" size={208} />
      </View>
      <View style={[styles.dateCard, { top: 28, width: 238 }]}>
        <Text variant="bodyMedium">Sữa tươi thanh trùng</Text>
        <Text variant="captionMeta" color="textSecondary">
          Hạn sử dụng · 21/10
        </Text>
      </View>
      <View style={[styles.dateCard, { top: 246, width: 245 }]}>
        <Text variant="bodyMedium">Bánh mì men tự nhiên</Text>
        <Text variant="captionMeta" color="textSecondary">
          Nên dùng trước · 20/10
        </Text>
      </View>
    </View>
  );
}

export type OnboardingPage = {
  key: string;
  stage: ReactNode;
  eyebrow: { text: string; pill: boolean };
  titleLines: [string, string];
  body: 'small' | 'large'; // SB-002 body is 14/21, SB-003/004 is 15
  bodyText: string;
  cta: string;
};

export const onboardingPages: OnboardingPage[] = [
  {
    key: 'rescue',
    stage: <RescueStage />,
    eyebrow: { text: 'Phần ngon cuối ngày', pill: true },
    titleLines: ['Món ngon còn đây,', 'chờ bạn ghé lấy.'],
    body: 'small',
    bodyText:
      'Chọn món quanh trường, giữ chỗ trước và đến nhận đúng giờ. Bạn thanh toán trực tiếp tại quầy.',
    cta: 'Tiếp tục',
  },
  {
    key: 'nearby',
    stage: <MapStage />,
    eyebrow: { text: 'Gần bạn, đúng khung giờ', pill: false },
    titleLines: ['Món ngon ngay', 'quanh trường'],
    body: 'large',
    bodyText:
      'Xem giá và khung giờ nhận trước khi đặt. Đến cửa hàng nhận món, thanh toán tại quầy.',
    cta: 'Tiếp tục',
  },
  {
    key: 'pantry',
    stage: <PantryStage />,
    eyebrow: { text: 'Tủ nhỏ, bớt quên hạn', pill: false },
    titleLines: ['Nhớ món ngon,', 'đừng quên ngày hạn'],
    body: 'large',
    bodyText:
      'Tự thêm thực phẩm vào tủ và đặt nhắc hạn. Dữ liệu lưu trên máy; bạn có thể dùng mà không cần đăng nhập.',
    cta: 'Bắt đầu sử dụng',
  },
];

/** Editorial copy block (Figma EditorialCopy / EditorialStoryCopy): 353 wide, gap 8 (pill variant: 12). */
export function OnboardingCopy({ page }: { page: OnboardingPage }) {
  return (
    <View style={[styles.copy, { gap: page.eyebrow.pill ? 12 : 8 }]}>
      {page.eyebrow.pill ? (
        <View style={styles.eyebrowPill}>
          <Text variant="eyebrowPill" color="price">
            {page.eyebrow.text}
          </Text>
        </View>
      ) : (
        <Text variant="eyebrow" color="textSecondary">
          {page.eyebrow.text}
        </Text>
      )}
      <View>
        <Text variant="displayHero">{page.titleLines[0]}</Text>
        <Text variant="displayHero">{page.titleLines[1]}</Text>
      </View>
      <Text variant={page.body === 'small' ? 'body' : 'bodyLg'} color="textSecondary">
        {page.bodyText}
      </Text>
    </View>
  );
}

export const ONBOARDING_STAGE_HEIGHT = STAGE_HEIGHT;

const styles = StyleSheet.create({
  stage: { height: STAGE_HEIGHT, overflow: 'hidden' },
  // SB-002
  ellipse: {
    position: 'absolute',
    left: 160,
    top: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.onboardingEllipse,
    opacity: 0.16,
  },
  veggieFrame: {
    position: 'absolute',
    left: 182,
    top: 32,
    width: 154,
    height: 190,
    overflow: 'hidden',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.white,
  },
  stageCard: { position: 'absolute', left: 22, top: 48, width: 170, height: 236, minHeight: 0 },
  reservePill: {
    position: 'absolute',
    left: 56,
    top: 296,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.brand900,
  },
  // SB-003
  mapBorder: { borderWidth: 1, borderColor: colors.borderDefault },
  mapImage: { position: 'absolute', left: -1, top: -1, width: 353, height: 340 },
  pin: {
    position: 'absolute',
    width: 199,
    height: 62,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  pinPrimary: { left: 17, top: 51, backgroundColor: colors.brand900 },
  pinSecondary: {
    left: 135,
    top: 177,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  windowBadge: {
    position: 'absolute',
    left: 17,
    top: 285,
    width: 317,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  // SB-004
  mam: { position: 'absolute', left: 141, top: 78, width: 208, height: 208 },
  dateCard: {
    position: 'absolute',
    left: 20,
    gap: 4,
    padding: 14,
    borderRadius: radius.input,
    backgroundColor: colors.canvas,
  },
  // copy
  copy: { width: 353, height: 192, overflow: 'hidden', alignItems: 'flex-start' },
  eyebrowPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSubtle,
  },
});
