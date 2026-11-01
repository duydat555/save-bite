import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { AppMap, MapControlGroup, MapDisclosure, PricePin } from '@/components/features/MapView';
import { CAMPUS } from '@/data/mock/mapPins';
import { openDirections } from '@/utils/maps';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';

// SB-065 · Directions · Active Order ("Điểm nhận"): real map (AppMap, full), floating merchant card, shared-coordinate
// "Điểm nhận" pin, order peek sheet; "Chỉ đường" opens Apple Maps.
export default function OrderDirections() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationWithOffer | null>(null);
  const map = useRef<MapView>(null);
  const coord = res?.offer.merchant.coord;
  // the map mounts before the merchant is loaded → move the camera when its coordinate arrives
  useEffect(() => {
    if (coord)
      map.current?.animateToRegion({ ...coord, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 450);
  }, [coord]);
  useEffect(() => {
    orderService.getReservation(id).then((r) => setRes(r ?? null));
  }, [id]);
  const range = res ? formatTimeRange(res.slotStart, res.slotEnd) : '';

  return (
    <View style={styles.container}>
      <AppMap
        ref={map}
        mode="full"
        style={StyleSheet.absoluteFill}
        region={{ ...(coord ?? CAMPUS), latitudeDelta: 0.004, longitudeDelta: 0.004 }}
        mapPadding={{ top: insets.top + 56, right: 0, bottom: 852 - 515, left: 0 }}
      >
        {coord ? (
          <Marker coordinate={coord} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <PricePin label="Điểm nhận" selected />
          </Marker>
        ) : null}
      </AppMap>
      <View style={{ backgroundColor: 'rgba(255,252,246,0.9)' }}>
        <View style={{ height: insets.top }} />
        <AppBar title="Điểm nhận" />
      </View>

      <View style={[styles.floating, { top: insets.top + 64 }]}>
        <Text variant="priceRow">{res?.offer.merchant.name ?? ' '}</Text>
        <Text variant="rowSub" color="textSecondary">{`Hôm nay · ${range}`}</Text>
      </View>

      <View style={styles.disclosure}>
        <MapDisclosure text="Vị trí và khoảng cách tham khảo" />
      </View>

      <View style={[styles.controls, { top: insets.top + 150 }]}>
        <MapControlGroup
          items={[
            {
              symbol: 'arrow.triangle.turn.up.right.diamond',
              label: 'Chỉ đường',
              onPress: () =>
                coord && openDirections(coord.latitude, coord.longitude, res?.offer.merchant.name),
            },
            {
              symbol: 'scope',
              label: 'Về điểm nhận',
              onPress: () =>
                coord &&
                map.current?.animateToRegion(
                  { ...coord, latitudeDelta: 0.004, longitudeDelta: 0.004 },
                  450,
                ),
            },
          ]}
        />
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
  controls: { position: 'absolute', right: 20 },
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
