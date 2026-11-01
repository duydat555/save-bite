import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/ui/GlassButton';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { PickupPass } from '@/features/reserve/PickupPass';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-063 · Pickup Code · Wallet Pass (dark). Frame offsets are relative to the 59pt status bar.
// Figma also has a hidden "DemoHotspot · staff scans → SB-072" (completion screen) — outside Vòng 1, not built.
export default function PickupCode() {
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
          <ActivityIndicator color={colors.canvas} />
        ) : (
          <Text variant="bodyMedium" color="canvas">
            Không tìm thấy đơn này.
          </Text>
        )}
      </View>
    );
  }

  const { offer } = res;
  const price = formatPrice(offer.priceVnd);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.close, { top: insets.top + 7 }]}>
        <GlassButton
          symbol="xmark"
          accessibilityLabel="Đóng"
          size={44}
          onPress={() => router.back()}
        />
      </View>
      <View style={[styles.title, { top: insets.top + 17 }]} pointerEvents="none">
        <Text variant="appBarTitle" color="canvas">
          Mã nhận món
        </Text>
      </View>

      <View style={[styles.pass, { top: insets.top + 81 }]}>
        <PickupPass
          ticketNo={res.ticketNo}
          range={formatTimeRange(res.slotStart, res.slotEnd)}
          image={offer.image}
          itemLine={`${res.quantity}× ${offer.title} · ${price}`}
          merchantLine={`${offer.merchant.name} · Trả tại quầy`}
          code={res.code}
        />
      </View>

      <View style={[styles.note, { top: insets.top + 487 }]}>
        <Text variant="linkMedium14" color="canvas" style={styles.noteText}>
          Nhân viên cửa hàng sẽ quét hoặc nhập mã này để xác nhận. Bạn không cần bấm “đã nhận”.
        </Text>
      </View>

      {/* Figma DemoHotspot · staff scans → SB-072: invisible 120×60 target; completes the order */}
      <Pressable
        accessibilityLabel="Giả lập nhân viên quét mã"
        onPress={async () => {
          await orderService.setStatus(res.id, 'completed');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace({ pathname: '/reserve/order/[id]', params: { id: res.id } });
        }}
        style={[styles.hotspot, { top: insets.top + 661 }]}
      />
      <View style={[styles.hint, { top: insets.top + 567 }]}>
        <SymbolView name="sun.max" size={18} tintColor={colors.canvas} />
        <Text variant="captionMeta" color="canvas">
          Tăng độ sáng màn hình để quét dễ hơn
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand900 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand900,
  },
  close: { position: 'absolute', left: layout.screenGutter },
  title: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pass: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
  note: { position: 'absolute', left: 40, right: 40 },
  noteText: { textAlign: 'center', lineHeight: 18 },
  hotspot: { position: 'absolute', left: 136, width: 120, height: 60 },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    width: 300,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
