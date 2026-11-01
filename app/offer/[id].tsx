import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllergenNotice } from '@/components/features/AllergenNotice';
import { InfoRow } from '@/components/features/InfoRow';
import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatDistance, formatPrice, formatStock, formatTimeRange } from '@/utils/format';

// SB-034 · Offer Detail · Exact Item. Hero 393×300, content sheet from y=268 (r28), sticky dock 98 incl. home indicator.
const HERO_HEIGHT = 300;
const SHEET_TOP = 268;
const DOCK_CONTENT = 64 + 4; // figma: 98 = 4 + 64 + 34 (home indicator)

export default function OfferDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [offer, setOffer] = useState<OfferWithMerchant | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    offerService.getOffer(id).then((o) => setOffer(o ?? null));
  }, [id]);

  if (offer === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand900} />
      </View>
    );
  }
  if (offer === null) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Không tìm thấy món này.</Text>
      </View>
    );
  }

  const { merchant } = offer;
  const range = formatTimeRange(offer.pickupStart, offer.pickupEnd);
  const pickupSub =
    merchant.pickupPoint ??
    (merchant.distanceM != null ? `Cách ${formatDistance(merchant.distanceM)}` : '');
  const dockHeight = DOCK_CONTENT + insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image source={offer.image} contentFit="cover" style={styles.hero} />
      <Pressable
        accessibilityLabel="Xem ảnh món"
        style={styles.heroTap}
        onPress={() => router.push({ pathname: '/offer/[id]/gallery', params: { id: offer.id } })}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']}
        style={styles.scrim}
        pointerEvents="none"
      />
      <View style={styles.heroTagLeft}>
        <Tag label="Ảnh minh họa" scheme="neutral" size="lg" />
      </View>
      <View style={styles.heroTagRight}>
        <Tag label={formatStock(offer.remaining, offer.unit)} size="lg" />
      </View>

      {/* MediaOverlayBar: 56 high at y=62 (3 below the 59 status bar) */}
      <View style={[styles.overlayBar, { top: insets.top + 3 }]}>
        <GlassButton
          symbol="chevron.left"
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
        />
        <GlassButton
          symbol={saved ? 'heart.fill' : 'heart'}
          accessibilityLabel="Lưu món"
          onPress={() => setSaved((v) => !v)}
        />
      </View>

      <View style={[styles.sheet, { top: SHEET_TOP, bottom: dockHeight }]}>
        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.head}>
            <View style={styles.kind}>
              <Text variant="detailTag" color="brand900">
                Món cụ thể
              </Text>
            </View>
            <View>
              <Text variant="detailTitle">{offer.title}</Text>
              <Text variant="detailPrice" color="price">
                {formatPrice(offer.priceVnd)}
              </Text>
            </View>
          </View>

          <Text variant="detailBody" color="textSecondary">
            {`${offer.title} từ ${merchant.name}. Thành phần, ngày sản xuất và bảo quản chưa được cửa hàng cung cấp.`}
          </Text>

          <InfoRow
            icon="pin"
            title={merchant.name}
            subtitle={pickupSub}
            chevron
            height={65}
            onPress={() =>
              router.push({ pathname: '/offer/merchant/[id]', params: { id: merchant.id } })
            }
          />
          <InfoRow
            icon="clock"
            title={`Hôm nay · ${range}`}
            subtitle={`Mở nhận lúc ${offer.pickupStart} · Giữ chỗ 0đ`}
            subtitleTone="success"
            height={64}
          />
          <AllergenNotice
            onPress={() =>
              router.push({ pathname: '/offer/[id]/allergens', params: { id: offer.id } })
            }
            title="Dị ứng & thành phần: Chưa xác nhận"
            body="Cửa hàng chưa khai báo danh sách dị ứng. Vui lòng hỏi nhân viên tại quầy trước khi nhận."
          />
          <Pressable
            accessibilityRole="button"
            style={styles.quality}
            onPress={() =>
              router.push({ pathname: '/offer/[id]/shelf-life', params: { id: offer.id } })
            }
          >
            <Text variant="rowSub" color="textSecondary">
              Chất lượng, ngày hạn & bảo quản
            </Text>
            <SvgIcon name="caret-right-24" size={16} />
          </Pressable>
        </ScrollView>
      </View>

      <View style={[styles.dock, { height: dockHeight, paddingBottom: insets.bottom }]}>
        <View style={styles.dockRow}>
          <View style={{ gap: 2 }}>
            <Text variant="dockLabel" color="textSecondary">
              Trả tại quầy · 1 phần
            </Text>
            <Text variant="detailPrice" color="price">
              {formatPrice(offer.priceVnd)}
            </Text>
          </View>
          <Button
            label="Chọn số lượng"
            style={styles.dockButton}
            onPress={() =>
              router.push({ pathname: '/offer/[id]/quantity', params: { id: offer.id } })
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
  hero: { position: 'absolute', left: 0, top: 0, right: 0, height: HERO_HEIGHT },
  heroTap: { position: 'absolute', left: 0, top: 0, right: 0, height: SHEET_TOP },
  scrim: { position: 'absolute', left: 0, top: 0, right: 0, height: 104 },
  heroTagLeft: { position: 'absolute', left: layout.screenGutter, top: 228 },
  heroTagRight: { position: 'absolute', right: 40, top: 228 }, // figma: tag ends at x=353
  overlayBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  sheetContent: { gap: 12, padding: layout.screenGutter },
  head: { gap: 6 },
  kind: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.tag,
    backgroundColor: colors.brand100,
  },
  quality: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  dockRow: {
    height: 64,
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
  },
  dockButton: { width: 167, height: 50, alignSelf: 'auto' },
});
