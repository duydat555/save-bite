import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoRow } from '@/components/features/InfoRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { OfferSummary } from '@/features/reserve/ReserveParts';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-052 · Pickup Checklist · Readback ("Hướng dẫn nhận món"), reached from SB-051's disclosure row.
export default function PickupChecklist() {
  const insets = useSafeAreaInsets();
  const { offerId, qty } = useLocalSearchParams<{ offerId: string; qty?: string }>();
  const n = Math.max(1, Number(qty) || 1);
  const offer = useOffer(offerId);

  if (!offer) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand900} />
      </View>
    );
  }
  const range = formatTimeRange(offer.pickupStart, offer.pickupEnd);
  const steps = [
    { title: `Đến đúng khung ${range}`, text: offer.merchant.pickupPoint ?? offer.merchant.name },
    {
      title: 'Mở mã sau khi giữ chỗ thành công',
      text: 'Mở mã trong đơn để nhân viên đối chiếu khi nhận.',
    },
    {
      title: 'Thanh toán tại quầy',
      text: `Đưa mã và trả ${formatPrice(offer.priceVnd * n)} khi nhận tại quầy.`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Hướng dẫn nhận món" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <OfferSummary
          image={offer.image}
          title={offer.title}
          merchant={offer.merchant.name}
          line={`${n} phần · ${formatPrice(offer.priceVnd * n)} (Trả tại quầy)`}
        />
        <InfoRow
          icon="pin"
          title={offer.merchant.name}
          subtitle={offer.merchant.pickupPoint}
          height={65}
        />
        {steps.map((s, i) => (
          <View key={s.title} style={styles.step}>
            <View style={styles.num}>
              <Text variant="eyebrow" color="brand900">
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text variant="bold15">{s.title}</Text>
              <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
                {s.text}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.note}>
          <Text variant="bold13">Đến trễ hoặc muốn hủy?</Text>
          <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
            {`Bạn có thể hủy miễn phí trước ${offer.pickupStart}. Nếu cần hỗ trợ, hãy báo sự cố trong đơn.`}
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Tôi đã hiểu, tiếp tục" onPress={() => router.back()} />
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
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 8 },
  num: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.brand100,
  },
  note: { gap: 6, padding: 16, borderRadius: radius.tile, backgroundColor: colors.surfaceSubtle },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
