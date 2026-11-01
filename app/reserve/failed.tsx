import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { OfferSummary } from '@/features/reserve/ReserveParts';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-057 · Reservation Failed · Network. Shown when a confirm fails (demo: armed from the dev hub).
export default function ReserveFailed() {
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
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Giữ chỗ" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 + 52 + 8 + 52 + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center' }}>
          <SvgIcon name="mam-retry" size={120} />
        </View>
        <Text variant="largeTitle" style={styles.center2}>
          Chưa giữ được chỗ
        </Text>
        <Text variant="body" color="textSecondary" style={[styles.center2, { lineHeight: 20 }]}>
          Kết nối bị gián đoạn nên SaveBite chưa xác nhận được phần của bạn. Bạn chưa bị tính phí.
        </Text>
        <Text variant="bold13" color="textSecondary" style={{ marginTop: 6 }}>
          Lựa chọn của bạn vẫn được giữ lại
        </Text>
        <OfferSummary
          image={offer.image}
          title={offer.title}
          merchant={offer.merchant.name}
          line={`${n} phần · ${formatPrice(offer.priceVnd * n)} (Trả tại quầy)`}
        />
        <Text variant="linkMedium13" color="textSecondary">
          {`Hôm nay · ${formatTimeRange(offer.pickupStart, offer.pickupEnd)} · Trả tại quầy`}
        </Text>
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Thử giữ chỗ lại" onPress={() => router.back()} />
        <Button
          label="Quay lại chi tiết món"
          variant="neutral"
          style={{ height: 52 }}
          onPress={() => router.dismissTo({ pathname: '/offer/[id]', params: { id: offer.id } })}
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
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  center2: { textAlign: 'center', fontSize: 22, lineHeight: 28 },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter, gap: 8 },
});
