import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { MapDisclosure } from '@/features/discovery/MapParts';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-065 · Directions · Active Order ("Điểm nhận"): static map, floating merchant card, pin, order peek sheet.
export default function OrderDirections() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationWithOffer | null>(null);
  useEffect(() => {
    orderService.getReservation(id).then((r) => setRes(r ?? null));
  }, [id]);
  const range = res ? formatTimeRange(res.slotStart, res.slotEnd) : '';

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/onboarding/campus-map.png')}
        contentFit="cover"
        style={styles.map}
      />
      <View style={{ backgroundColor: 'rgba(255,252,246,0.9)' }}>
        <View style={{ height: insets.top }} />
        <AppBar title="Điểm nhận" />
      </View>

      <View style={[styles.floating, { top: insets.top + 64 }]}>
        <Text variant="priceRow">{res?.offer.merchant.name ?? ' '}</Text>
        <Text variant="rowSub" color="textSecondary">{`Hôm nay · ${range}`}</Text>
      </View>

      <View style={styles.pin}>
        <View style={styles.pinBody}>
          <Text variant="semi14" color="white">
            Điểm nhận
          </Text>
        </View>
        <View style={styles.pinTail} />
      </View>
      <View style={styles.disclosure}>
        <MapDisclosure text="Vị trí và khoảng cách tham khảo" />
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        {res ? (
          <View style={{ marginTop: 14 }}>
            <OfferListRow
              image={res.offer.image}
              title={res.offer.title}
              merchantLine={res.offer.merchant.name}
              priceLabel={formatPrice(res.offer.priceVnd)}
              availabilityLabel={range}
            />
          </View>
        ) : null}
        <Text variant="rowSub" color="textSecondary" style={{ marginTop: 14, lineHeight: 20 }}>
          Đến đúng giờ trong đơn. Hãy xác nhận địa chỉ và lối vào với cửa hàng trước khi đi.
        </Text>
        <Button
          label="Xem mã nhận món"
          style={{ marginTop: 14 }}
          onPress={() => router.push({ pathname: '/reserve/order/[id]/pass', params: { id } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  map: { position: 'absolute', left: 0, top: 0, right: 0, height: 540 },
  floating: {
    position: 'absolute',
    left: layout.screenGutter,
    right: layout.screenGutter,
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
  },
  pin: { position: 'absolute', left: 218, top: 397, width: 92, alignItems: 'center' },
  pinBody: {
    height: 32,
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.price,
  },
  pinTail: {
    width: 10,
    height: 10,
    marginTop: -5,
    transform: [{ rotate: '45deg' }],
    backgroundColor: colors.price,
  },
  disclosure: { position: 'absolute', left: 16, top: 470 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 514,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 13,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.dotInactive },
});
