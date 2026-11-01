import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoRow } from '@/components/features/InfoRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { CLOSED_SLOT, DEMO_DATE_LONG, DEMO_DATE_SHORT } from '@/constants/demo';
import { colors, layout } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { OfferSummary, PickupSlot, ReservationProgress } from '@/features/reserve/ReserveParts';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-051 · Reservation · Pickup Slot (step 1/2). Quantity is fixed at 1 — SB-050 (quantity sheet) is outside Vòng 1.
export default function ReserveSlot() {
  const insets = useSafeAreaInsets();
  const { offerId, qty } = useLocalSearchParams<{ offerId: string; qty?: string }>();
  const n = Math.max(1, Number(qty) || 1);
  const offer = useOffer(offerId);

  if (!offer) {
    return (
      <View style={styles.center}>
        {offer === undefined ? (
          <ActivityIndicator color={colors.brand900} />
        ) : (
          <Text variant="bodyMedium">Không tìm thấy món này.</Text>
        )}
      </View>
    );
  }

  const { merchant } = offer;
  const range = formatTimeRange(offer.pickupStart, offer.pickupEnd);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Chọn giờ nhận" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ReservationProgress step="slot" />
        <OfferSummary
          image={offer.image}
          title={offer.title}
          merchant={merchant.name}
          line={`${n} phần · ${formatPrice(offer.priceVnd * n)} (Trả tại quầy)`}
        />

        <View style={{ gap: 10 }}>
          <Text variant="bold15">{`Khung giờ nhận hôm nay · ${DEMO_DATE_LONG}`}</Text>
          <PickupSlot
            selected
            title={`${range} · Hôm nay (${DEMO_DATE_SHORT})`}
            hint={`Mở nhận lúc ${offer.pickupStart} · Giữ chỗ 0đ`}
          />
          <PickupSlot title={CLOSED_SLOT.title} hint={CLOSED_SLOT.hint} />
        </View>

        <InfoRow icon="pin" title={merchant.name} subtitle={merchant.pickupPoint} height={65} />

        <View style={styles.notes}>
          <Text variant="link">Lưu ý giữ chỗ &amp; hủy đơn</Text>
          <Text variant="note13" color="textSecondary">
            {`Bạn có thể hủy miễn phí trước ${offer.pickupStart}. Nếu cần hỗ trợ, hãy báo sự cố trong đơn.`}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.disclosure}
            onPress={() =>
              router.push({
                pathname: '/reserve/[offerId]/checklist',
                params: { offerId: offer.id, qty: String(n) },
              })
            }
          >
            <Text variant="disclosure" color="price" style={{ flex: 1 }}>
              Xem hướng dẫn nhận món
            </Text>
            <SvgIcon name="caret-right-16" size={16} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button
          label="Tiếp tục kiểm tra đơn →"
          onPress={() =>
            router.push({
              pathname: '/reserve/summary',
              params: { offerId: offer.id, qty: String(n) },
            })
          }
        />
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
  content: { gap: 16, paddingHorizontal: layout.screenGutter },
  notes: { gap: 8, paddingTop: 4 },
  disclosure: { height: 44, flexDirection: 'row', alignItems: 'center', gap: 12 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
