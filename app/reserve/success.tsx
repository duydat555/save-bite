import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { duration, easing, spring } from '@/design-system/motion';
import { colors, layout, radius } from '@/design-system/tokens';
import { useStaggerEntering } from '@/hooks/useEntering';
import { PickupPass } from '@/features/reserve/PickupPass';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-056 · Success · Perforated Pickup Pass.
// Motion: success haptic; a transient Mầm "Carry" + tick badge pops in over the screen (spring) and fades away,
// leaving the static Figma layout untouched; header lines rise in; the pass scales/fades in; footer follows.
export default function ReserveSuccess() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationWithOffer | null | undefined>(undefined);
  const entering = useStaggerEntering();
  const reduced = useReducedMotion();

  useEffect(() => {
    orderService.getReservation(id).then((r) => setRes(r ?? null));
  }, [id]);

  const ready = !!res;
  useEffect(() => {
    if (ready) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [ready]);

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

  const { offer } = res;
  const range = formatTimeRange(res.slotStart, res.slotEnd);
  const price = formatPrice(offer.priceVnd);
  const toOrders = () => router.replace('/(tabs)/orders');
  const passEntering = reduced
    ? FadeIn.duration(duration.fast)
    : ZoomIn.delay(220)
        .duration(duration.slow)
        .easing(easing.enter)
        .withInitialValues({ transform: [{ scale: 0.94 }] });

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Vé nhận món" onClose={toOrders} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.celebrate}>
          <Animated.View entering={entering(0, 100)} style={styles.unpaid}>
            <Text variant="detailTag" color="warning">
              {`Chưa thanh toán · Trả ${price} tại quầy`}
            </Text>
          </Animated.View>
          <Animated.View entering={entering(1, 100)}>
            <Text variant="authTitle">{`Đã giữ ${res.quantity} phần cho bạn!`}</Text>
          </Animated.View>
          <Animated.View entering={entering(2, 100)}>
            <Text variant="captionMeta" color="textSecondary">
              {`Nhận tại ${offer.merchant.name} · ${range} hôm nay`}
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={passEntering}>
          <PickupPass
            ticketNo={res.ticketNo}
            range={range}
            image={offer.image}
            itemLine={`${res.quantity}× ${offer.title} · ${price}`}
            merchantLine={`${offer.merchant.name} · Thanh toán tại quầy`}
            code={res.code}
          />
        </Animated.View>

        <Animated.View entering={entering(5, 150)} style={styles.checklist}>
          <Text variant="noticeTitle">{offer.merchant.pickupPoint ?? offer.merchant.name}</Text>
          <Text variant="noticeBody" color="textSecondary">
            {`Đưa mã và trả ${price} khi nhận tại quầy.`}
          </Text>
          <SvgIcon name="pin" size={14} />
        </Animated.View>
      </ScrollView>

      <Animated.View
        entering={
          reduced
            ? FadeIn.duration(duration.fast)
            : FadeInDown.delay(420).duration(duration.base).easing(easing.enter)
        }
        style={[styles.footer, { bottom: insets.bottom + 20 }]}
      >
        {/* Directions (SB-065) is outside Vòng 1 — inert */}
        <Button label="Chỉ đường" variant="neutral" style={styles.half} />
        <Button label="Xem đơn của tôi" onPress={toOrders} style={styles.half} />
      </Animated.View>

      <SuccessBurst />
    </View>
  );
}

/** Transient celebration: Mầm (Carry) with a tick badge springs in, holds ~0.7 s, then fades and unmounts. */
function SuccessBurst() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const scale = useSharedValue(reduced ? 1 : 0.5);
  const opacity = useSharedValue(0);
  const tick = useSharedValue(0);

  useEffect(() => {
    if (!reduced) scale.value = withSpring(1, spring.bounce);
    opacity.value = withSequence(
      withTiming(1, { duration: duration.base }),
      withDelay(reduced ? 500 : 800, withTiming(0, { duration: duration.base })),
    );
    tick.value = withDelay(reduced ? 0 : 180, withSpring(1, spring.bounce));
    const id = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(id);
  }, [reduced, scale, opacity, tick]);

  const wrap = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const badge = useAnimatedStyle(() => ({ transform: [{ scale: tick.value }] }));

  if (!visible) return null;
  return (
    <View pointerEvents="none" style={styles.burstLayer}>
      <Animated.View style={[styles.burst, wrap]}>
        <SvgIcon name="mam-carry" size={150} />
        <Animated.View style={[styles.tick, badge]}>
          <SymbolView name="checkmark" size={20} weight="bold" tintColor={colors.white} />
        </Animated.View>
      </Animated.View>
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
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 0 },
  celebrate: { alignItems: 'center', gap: 4, paddingTop: 0 },
  unpaid: {
    height: 22,
    width: 312,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.warningBg,
  },
  checklist: {
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceSubtle,
  },
  footer: {
    position: 'absolute',
    left: layout.screenGutter,
    right: layout.screenGutter,
    flexDirection: 'row',
    gap: 13,
  },
  half: { flex: 1, height: 52 },
  burstLayer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  burst: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 95,
    backgroundColor: 'rgba(255,252,246,0.94)',
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  tick: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.success,
  },
});
