import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors } from '@/design-system/tokens';
import { AppMap, MapControlGroup, MapDisclosure, PricePin } from '@/components/features/MapView';
import { CAMPUS } from '@/data/mock/mapPins';
import { openDirections } from '@/utils/maps';
import { offerService } from '@/services/offerService';
import type { Merchant } from '@/types';

// SB-039 · Đường tới cửa hàng · Walking Map: real map (AppMap, full) with the "Điểm nhận" pin at the merchant's shared
// coordinate; the route sheet starts at y=514. Controls: "Chỉ đường" opens Apple Maps. Position is a demo ("Ghim mẫu").
export default function MerchantDirections() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const map = useRef<MapView>(null);
  const coord = merchant?.coord;
  // the map mounts before the merchant is loaded → move the camera when its coordinate arrives
  useEffect(() => {
    if (coord)
      map.current?.animateToRegion({ ...coord, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 450);
  }, [coord]);

  useEffect(() => {
    offerService
      .listOffers()
      .then((all) => setMerchant(all.find((o) => o.merchantId === id)?.merchant ?? null));
  }, [id]);

  return (
    <View style={styles.container}>
      <AppMap
        ref={map}
        mode="full"
        style={StyleSheet.absoluteFill}
        region={{ ...(coord ?? CAMPUS), latitudeDelta: 0.004, longitudeDelta: 0.004 }}
        mapPadding={{ top: insets.top + 56, right: 0, bottom: 852 - 514, left: 0 }}
      >
        {coord ? (
          <Marker coordinate={coord} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <PricePin label="Điểm nhận" selected />
          </Marker>
        ) : null}
      </AppMap>
      {/* AppBar sits on an opaque canvas strip above the map (Figma: map starts below the bar) */}
      <View style={{ backgroundColor: colors.canvas }}>
        <View style={{ height: insets.top }} />
        <AppBar title="Vị trí cửa hàng" />
      </View>

      <View style={styles.disclosure}>
        <MapDisclosure text="Vị trí và khoảng cách tham khảo" />
      </View>

      <View style={[styles.controls, { top: insets.top + 72 }]}>
        <MapControlGroup
          items={[
            {
              symbol: 'arrow.triangle.turn.up.right.diamond',
              label: 'Chỉ đường',
              onPress: () =>
                coord && openDirections(coord.latitude, coord.longitude, merchant?.name),
            },
            {
              symbol: 'scope',
              label: 'Về cửa hàng',
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

      <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
        <Text variant="authTitle" style={{ lineHeight: 28 }}>
          {merchant?.name ?? ' '}
        </Text>
        <Text variant="authSub" color="textSecondary" style={styles.addr}>
          {merchant?.pickupPoint ?? ''}
        </Text>
        <Text variant="detailBody" color="textSecondary" style={styles.note}>
          Vị trí cửa hàng chưa được xác nhận. Hãy hỏi cửa hàng địa chỉ và lối vào trước khi đến
          nhận.
        </Text>
        <Button
          label="Xem chi tiết món"
          onPress={() => router.push({ pathname: '/offer/merchant/[id]/offers', params: { id } })}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  controls: { position: 'absolute', right: 20 },
  disclosure: { position: 'absolute', left: 16, top: 470 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 514,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  addr: { marginTop: 16, lineHeight: 20 },
  note: { marginTop: 16 },
  cta: { marginTop: 16 },
});
