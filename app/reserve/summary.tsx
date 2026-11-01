import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AllergenNotice } from '@/components/features/AllergenNotice';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { duration } from '@/design-system/motion';
import { colors, layout, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';
import { ReceiptCard, ReservationProgress } from '@/features/reserve/ReserveParts';
import { useDevFlags } from '@/store/devFlags';
import { orderService } from '@/services/orderService';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-053 · Order Summary · Unified Receipt (step 2/2) + SB-055 · Processing as an overlay on the same screen
// (Figma: "ProcessingVeil" rgba(255,252,246,0.8) over the receipt, native spinner, loading CTA).
// The confirm sheet (SB-054) is skipped. Processing lasts ≥1.2 s so the state is visible; the guard ref makes the
// confirm idempotent (a second tap cannot create a second reservation).
const PROCESSING_MS = 1200;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ReserveSummary() {
  const insets = useSafeAreaInsets();
  const { offerId, qty } = useLocalSearchParams<{ offerId: string; qty?: string }>();
  const n = Math.max(1, Number(qty) || 1);
  const offer = useOffer(offerId);
  const [processing, setProcessing] = useState(false);
  const submitted = useRef(false);

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

  const range = formatTimeRange(offer.pickupStart, offer.pickupEnd);
  const price = formatPrice(offer.priceVnd);
  const total = formatPrice(offer.priceVnd * n);

  const confirm = async () => {
    if (submitted.current) return;
    submitted.current = true;
    setProcessing(true);
    // Demo hotspot (SB-055): the dev hub can arm a failure for the next confirm.
    const fail = useDevFlags.getState().failNext;
    if (fail) {
      useDevFlags.getState().arm(null);
      await wait(PROCESSING_MS);
      router.replace({
        pathname: fail === 'offline' ? '/reserve/failed' : '/reserve/stock-changed',
        params: { offerId: offer.id, qty: String(n) },
      });
      return;
    }
    const [reservation] = await Promise.all([
      orderService.createReservation(offer.id, n),
      wait(PROCESSING_MS),
    ]);
    router.replace({ pathname: '/reserve/success', params: { id: reservation.id } });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ gestureEnabled: !processing }} />
      <View style={{ height: insets.top }} />
      <AppBar title="Kiểm tra đặt trước" onBack={() => !processing && router.back()} />
      <ScrollView
        scrollEnabled={!processing}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ReservationProgress step="review" chosenRange={range} />
        <View>
          <ReceiptCard
            perforated
            image={offer.image}
            title={offer.title}
            merchant={offer.merchant.name}
            when={`Hôm nay · ${range}`}
            rows={[
              { label: 'Số lượng × đơn giá', value: `${n} phần × ${price}` },
              { label: 'Phí giữ chỗ', value: '0đ (Miễn phí)', tone: 'success' },
              { label: 'Thanh toán', value: 'Trả trực tiếp tại quầy' },
              { label: 'Hủy đơn', value: `Hủy miễn phí trước ${offer.pickupStart}`, tone: 'muted' },
            ]}
            totalLabel="Trả tại quầy"
            total={total}
          />
          {processing ? (
            <Animated.View
              entering={FadeIn.duration(duration.base)}
              exiting={FadeOut.duration(duration.fast)}
              style={styles.veil}
              accessibilityLiveRegion="polite"
            >
              <View style={styles.spinner}>
                <ActivityIndicator size="large" color={colors.brand900} />
              </View>
              <Text variant="semi16" style={styles.veilTitle}>
                {`Đang kiểm tra và giữ ${n} phần…`}
              </Text>
              <Text variant="rowSub" color="textSecondary" style={styles.veilHint}>
                Vui lòng không đóng màn hình này
              </Text>
            </Animated.View>
          ) : null}
        </View>
        {/* Allergen details (SB-036) is outside Vòng 1 — inert */}
        <Pressable accessibilityRole="button">
          <AllergenNotice
            title="Dị ứng & thành phần: Chưa xác nhận"
            body="Cửa hàng chưa khai báo danh sách dị ứng. Vui lòng hỏi nhân viên tại quầy trước khi nhận."
          />
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button
          label={processing ? 'Đang giữ chỗ…' : 'Xác nhận giữ chỗ'}
          loading={processing}
          onPress={confirm}
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
  content: { gap: 18, paddingHorizontal: layout.screenGutter },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
  // figma ProcessingVeil: 353×298 at the card's top-left, r20
  veil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 298,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,252,246,0.8)',
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
    top: 96,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  veilTitle: { position: 'absolute', top: 156 },
  veilHint: { position: 'absolute', top: 184 },
});
