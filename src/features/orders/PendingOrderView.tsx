import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

const hourBefore = (hhmm: string) =>
  `${String(Number(hhmm.slice(0, 2)) - 1).padStart(2, '0')}:${hhmm.slice(3)}`;

/**
 * SB-061 · Pending Orders · Timeline: the waiting order with a brand900 header strip, the pickup-window timeline and the
 * "Mở mã nhận" / "Chỉ đường" buttons. Entered from the active-order strip on Khám phá (SB-014). The "còn 1 giờ nữa"
 * caption is the literal Figma text (fixed demo clock).
 */
export function PendingOrderView({ res }: { res: ReservationWithOffer }) {
  const { offer } = res;
  const steps = [
    { time: hourBefore(res.slotStart), text: 'Bắt đầu chuẩn bị', on: false },
    { time: res.slotStart, text: 'Mở nhận · bạn có thể tới', on: true },
    { time: res.slotEnd, text: 'Đóng khung nhận', on: false },
  ];
  const id = res.id;
  return (
    <View style={{ gap: 16 }}>
      <View style={styles.card}>
        <View style={styles.strip}>
          <Text variant="link" color="white">
            {`Hôm nay · ${formatTimeRange(res.slotStart, res.slotEnd)} (còn 1 giờ nữa)`}
          </Text>
        </View>
        <View style={styles.body}>
          <Image source={offer.image} contentFit="cover" style={styles.photo} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="semi16" numberOfLines={1}>
              {offer.title}
            </Text>
            <Text variant="rowSubMedium" color="textSecondary">
              {`${offer.merchant.name} · ${res.quantity} phần`}
            </Text>
            <Text variant="bold15" color="price">
              {`Trả ${formatPrice(offer.priceVnd * res.quantity)} tại quầy`}
            </Text>
          </View>
        </View>
        <View style={styles.cta}>
          <Button
            label="Mở mã QR nhận món"
            style={{ height: 50 }}
            onPress={() => router.push({ pathname: '/reserve/order/[id]/pass', params: { id } })}
          />
        </View>
      </View>

      <Text variant="bold15">Tiến trình khung nhận hôm nay</Text>
      <View style={styles.timeline}>
        {steps.map((s) => (
          <View key={s.time} style={styles.step}>
            <View style={[styles.dot, s.on ? styles.dotOn : styles.dotOff]} />
            <Text
              variant={s.on ? 'bold14' : 'rowSubMedium'}
              color={s.on ? 'brand900' : 'textSecondary'}
              style={{ width: 44 }}
            >
              {s.time}
            </Text>
            <Text
              variant={s.on ? 'bold14' : 'rowSubMedium'}
              color={s.on ? 'textPrimary' : 'textSecondary'}
            >
              {s.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <Button
          label="Mở mã nhận"
          style={{ width: 114, height: 52 }}
          onPress={() => router.push({ pathname: '/reserve/order/[id]/pass', params: { id } })}
        />
        <Button
          label="Chỉ đường"
          variant="neutral"
          style={{ flex: 1, height: 52 }}
          onPress={() =>
            router.push({ pathname: '/reserve/order/[id]/directions', params: { id } })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  strip: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.brand900,
  },
  body: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingTop: 16 },
  photo: { width: 64, height: 64, borderRadius: 8 },
  cta: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 16 },
  timeline: {
    gap: 14,
    padding: 16,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotOn: { backgroundColor: colors.brand900 },
  dotOff: { borderWidth: 1.5, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  buttons: { flexDirection: 'row', gap: 12 },
});
