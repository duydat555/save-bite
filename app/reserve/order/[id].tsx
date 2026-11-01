import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import {
  ClosingSoonView,
  CompletedView,
  ExpiredView,
  ReadyView,
} from '@/features/orders/OrderStates';
import { ReceiptCard } from '@/features/reserve/ReserveParts';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-062 · Order Detail · Awaiting Pickup. Cancel (SB-070 sheet) and report issue (SB-069) are outside Vòng 1 — inert.
export default function OrderDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationWithOffer | null | undefined>(undefined);

  useEffect(() => {
    orderService.getReservation(id).then((r) => setRes(r ?? null));
  }, [id]);

  if (!res) {
    return (
      <View style={styles.center}>
        {res === undefined ? (
          <ActivityIndicator color={colors.brand900} />
        ) : (
          <Text variant="bodyMedium">Không tìm thấy đơn này.</Text>
        )}
      </View>
    );
  }

  if (res.status === 'ready') return <ReadyView res={res} />;
  if (res.status === 'closing_soon') return <ClosingSoonView res={res} />;
  if (res.status === 'expired') return <ExpiredView res={res} />;
  if (res.status === 'completed') return <CompletedView res={res} />;

  const { offer } = res;
  const range = formatTimeRange(res.slotStart, res.slotEnd);
  const price = formatPrice(offer.priceVnd);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Chi tiết đơn" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <Text variant="eyebrow" color="warning">
              Đã giữ chỗ · Chờ đến giờ nhận
            </Text>
          </View>
          <Text variant="bold13" color="textSecondary">
            {res.ticketNo}
          </Text>
        </View>

        <Timeline
          steps={['Đã giữ chỗ', `Đến nhận ${res.slotStart}`, 'Hoàn tất']}
          currentIndex={0}
        />

        <ReceiptCard
          image={offer.image}
          title={offer.title}
          merchant={offer.merchant.name}
          when={`Hôm nay · ${range}`}
          rows={[
            { label: 'Số lượng × đơn giá', value: `${res.quantity} phần × ${price}` },
            { label: 'Phí giữ chỗ', value: '0đ (Miễn phí)', tone: 'success' },
            { label: 'Thanh toán', value: 'Trả trực tiếp tại quầy' },
            { label: 'Hủy đơn', value: `Hủy miễn phí trước ${res.slotStart}`, tone: 'muted' },
          ]}
          totalLabel="Trả tại quầy"
          total={formatPrice(offer.priceVnd * res.quantity)}
        />

        <View style={{ gap: 8, marginTop: 8 }}>
          <Button
            label="Xem mã nhận món"
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/pass', params: { id: res.id } })
            }
          />
          <Button
            label="Chỉ đường tới điểm nhận"
            variant="neutral"
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/directions', params: { id: res.id } })
            }
          />
        </View>

        <View>
          <Pressable
            accessibilityRole="button"
            style={styles.action}
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/cancel', params: { id: res.id } })
            }
          >
            <Text variant="semi14" color="danger">
              {`Hủy đặt trước · miễn phí trước ${res.slotStart}`}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.action}
            onPress={() =>
              router.push({ pathname: '/reserve/order/[id]/incident', params: { id: res.id } })
            }
          >
            <Text variant="linkMedium14" color="textSecondary">
              Báo sự cố
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* OrderStatusTimeline (353×56): 14pt dots on a 128pt pitch joined by 104pt rules, labels under the dots. */
function Timeline({ steps, currentIndex }: { steps: string[]; currentIndex: number }) {
  return (
    <View style={styles.timeline}>
      {steps.map((label, i) => {
        const done = i <= currentIndex;
        return (
          <View key={label} style={[styles.step, { left: i * 128 }]}>
            <View style={[styles.dot, done ? styles.dotDone : styles.dotTodo]} />
            {i < steps.length - 1 ? <View style={styles.rule} /> : null}
            <Text
              variant={i === currentIndex ? 'eyebrow' : 'meta'}
              color={i === currentIndex ? 'textPrimary' : 'textSecondary'}
              style={styles.stepLabel}
            >
              {label}
            </Text>
          </View>
        );
      })}
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
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 7 },
  statusRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.warningBg,
  },
  timeline: { height: 56 },
  step: { position: 'absolute', top: 0, width: 120 },
  dot: { position: 'absolute', left: 0, top: 4, width: 14, height: 14, borderRadius: 7 },
  dotDone: { backgroundColor: colors.brand900 },
  dotTodo: { borderWidth: 2, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  rule: {
    position: 'absolute',
    left: 18,
    top: 10,
    width: 104,
    height: 2,
    backgroundColor: colors.borderDefault,
  },
  stepLabel: { position: 'absolute', left: 0, top: 26 },
  action: { height: 48, alignItems: 'center', justifyContent: 'center' },
});
