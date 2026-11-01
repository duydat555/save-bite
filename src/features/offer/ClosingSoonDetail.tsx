import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllergenNotice } from '@/components/features/AllergenNotice';
import { InfoRow } from '@/components/features/InfoRow';
import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import type { OfferWithMerchant } from '@/types';
import { formatTimeRange } from '@/utils/format';

/**
 * SB-048 · Gần đóng cửa · Closing Soon Urgency: a different layout from SB-034 — full-width warning strip under the
 * status bar, 306pt hero, title with "· 25K", merchant lines, pickup row ("Đang mở nhận · Đóng lúc 18:00"), allergen
 * notice and a single full-width "Giữ phần này" CTA. Strip copy is the literal Figma text (fixed demo clock 17:40).
 */
export function ClosingSoonDetail({
  offer,
  saved,
  onToggleSaved,
  onReserve,
}: {
  offer: OfferWithMerchant;
  saved: boolean;
  onToggleSaved: () => void;
  onReserve: () => void;
}) {
  const insets = useSafeAreaInsets();
  const price = `${Math.round(offer.priceVnd / 1000)}K`;
  return (
    <View style={styles.container}>
      <View style={[styles.strip, { paddingTop: insets.top }]}>
        <View style={styles.stripRow}>
          <SymbolView name="clock" size={16} tintColor={colors.warning} />
          <Text variant="bold14" color="warning">
            Còn 20 phút đến 18:00 · Còn 1 phần
          </Text>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View>
          <Image source={offer.image} contentFit="cover" style={styles.hero} />
          <View style={styles.overlay}>
            <GlassButton
              symbol="chevron.left"
              accessibilityLabel="Quay lại"
              onPress={() => router.back()}
            />
            <GlassButton
              symbol={saved ? 'heart.fill' : 'heart'}
              accessibilityLabel="Lưu món"
              onPress={onToggleSaved}
            />
          </View>
        </View>
        <View style={styles.body}>
          <Text variant="heroTitle" style={{ fontSize: 24, lineHeight: 30 }}>
            {`${offer.title} · ${price}`}
          </Text>
          <View style={{ gap: 2 }}>
            <Text variant="rowSub" color="textSecondary">
              {offer.merchant.name}
            </Text>
            <Text variant="rowSub" color="textSecondary">
              Khu ẩm thực sinh viên · Cơ sở 1
            </Text>
          </View>
          <View style={{ height: 36 }} />
          <InfoRow
            icon="clock"
            title={`Hôm nay · ${formatTimeRange(offer.pickupStart, offer.pickupEnd)}`}
            subtitle="Đang mở nhận · Đóng lúc 18:00"
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
          <Button label="Giữ phần này" onPress={onReserve} style={{ marginTop: 12 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  strip: {
    backgroundColor: colors.warningBg,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.warning,
  },
  stripRow: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  hero: { width: '100%', height: 306 },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
  },
  body: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 20 },
});
