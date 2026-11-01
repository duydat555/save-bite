import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackTabBar } from '@/components/features/GlassTabBar';
import { OfferListRow } from '@/components/features/OfferListRow';
import { DetentSheet } from '@/components/ui/DetentSheet';
import { Text } from '@/components/ui/Text';
import { CAMPUS, INITIAL_DELTA, MAP_PINS, USER_SPOT } from '@/data/mock/mapPins';
import { duration, mapMotion } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';
import {
  ClusterBubble,
  MapChip,
  MapControlGroup,
  MapDisclosure,
  PricePin,
  UserDot,
} from '@/features/discovery/MapParts';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { SearchInputBar } from '@/features/discovery/SearchParts';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

// SB-016 · Map · Campus Explorer + SB-017 · peek sheet, on a real Apple Map (react-native-maps, runs in Expo Go).
// Figma wins where it draws something (chips, price-pin colours/size, peek sheet 361×152 above the tab bar); the rest
// follows Apple Maps: muted standard map without POI/compass/scale, glass control group, detent bottom sheet, clustering.
// Pin coordinates are demo values ("Ghim mẫu"), see src/data/mock/mapPins.ts.
const TAB = 65; // figma: sheet bottom sits 65 above the safe area (tab bar)
const PEEK = 152; // figma MapPeekSheet height

type Cluster = { id: string; latitude: number; longitude: number; ids: string[] };

/** Greedy grid clustering: pins closer than ~14% of the visible span merge into one bubble. */
function cluster(pins: { offerId: string; latitude: number; longitude: number }[], r: Region) {
  const cell = r.latitudeDelta * 0.14;
  const out: Cluster[] = [];
  for (const p of pins) {
    const hit = out.find(
      (c) => Math.abs(c.latitude - p.latitude) < cell && Math.abs(c.longitude - p.longitude) < cell,
    );
    if (hit) {
      const n = hit.ids.length;
      hit.latitude = (hit.latitude * n + p.latitude) / (n + 1);
      hit.longitude = (hit.longitude * n + p.longitude) / (n + 1);
      hit.ids.push(p.offerId);
      hit.id = hit.ids.join('+');
    } else
      out.push({ id: p.offerId, latitude: p.latitude, longitude: p.longitude, ids: [p.offerId] });
  }
  return out;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const map = useRef<MapView>(null);
  const [offers, setOffers] = useState<Record<string, OfferWithMerchant>>({});
  const [selected, setSelected] = useState('offer-banh-mi-men-tu-nhien');
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [standard, setStandard] = useState(false);
  const [locating, setLocating] = useState(false);
  const [region, setRegion] = useState<Region>({ ...CAMPUS, ...INITIAL_DELTA });
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    offerService
      .listOffers()
      .then((list) => setOffers(Object.fromEntries(list.map((o) => [o.id, o]))));
  }, []);

  // detents (visible heights): Figma peek · half · almost full (stays below the search + chips chrome)
  const bottomOffset = insets.bottom + TAB;
  const detents = useMemo(
    () => [PEEK, Math.round(height * 0.5), height - bottomOffset - insets.top - 128],
    [height, bottomOffset, insets.top],
  );

  // custom Marker views are snapshotted: keep tracking on while something animates, then switch it off (perf)
  const trackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bumpTracking = useCallback(() => {
    setTracking(true);
    clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(() => setTracking(false), 900);
  }, []);
  useEffect(() => () => clearTimeout(trackTimer.current), []);

  const clusters = useMemo(() => cluster([...MAP_PINS], region), [region]);

  /** Centre `coord` in the area not covered by the sheet at detent `i` (mapPadding already clears the peek height). */
  const focus = useCallback(
    (coord: { latitude: number; longitude: number }, i: number, zoom?: number) => {
      const delta = Math.min(zoom ?? region.latitudeDelta, 0.012);
      const extra = Math.max(detents[i] - PEEK, 0) / 2;
      map.current?.animateToRegion(
        {
          latitude: coord.latitude - delta * (extra / height),
          longitude: coord.longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        mapMotion.camera,
      );
    },
    [detents, height, region.latitudeDelta],
  );

  const selectPin = (offerId: string) => {
    const pin = MAP_PINS.find((p) => p.offerId === offerId);
    if (!pin) return;
    Haptics.selectionAsync();
    setSelected(offerId);
    bumpTracking();
    setIndex(0);
    setLocating(false);
    focus(pin, 0);
  };

  const zoomInto = (c: Cluster) => {
    Haptics.selectionAsync();
    const members = MAP_PINS.filter((p) => c.ids.includes(p.offerId));
    map.current?.fitToCoordinates(members, {
      edgePadding: { top: 160, right: 60, bottom: PEEK + bottomOffset + 40, left: 60 },
      animated: true,
    });
  };

  const listed = index === 0 ? [selected] : MAP_PINS.map((p) => p.offerId);

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...CAMPUS, ...INITIAL_DELTA }}
        mapType={standard ? 'standard' : 'mutedStandard'}
        userInterfaceStyle="light"
        showsPointsOfInterests={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        rotateEnabled={false}
        pitchEnabled={false}
        // keeps Apple's logo / legal text and the map centre above the peek sheet + tab bar, under the chrome
        mapPadding={{ top: insets.top + 112, right: 0, bottom: PEEK + bottomOffset, left: 0 }}
        onMapReady={() => {
          setReady(true);
          bumpTracking();
        }}
        onRegionChangeComplete={(r) => {
          setRegion(r);
          bumpTracking();
          if (
            Math.abs(r.latitude - USER_SPOT.latitude) > 0.001 ||
            Math.abs(r.longitude - USER_SPOT.longitude) > 0.001
          )
            setLocating(false);
        }}
      >
        {ready ? (
          <>
            <Marker
              coordinate={USER_SPOT}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges
              zIndex={1}
              tappable={false}
            >
              <UserDot />
            </Marker>
            {clusters.map((c, i) =>
              c.ids.length > 1 ? (
                <Marker
                  key={`c-${c.id}`}
                  coordinate={c}
                  anchor={{ x: 0.5, y: 0.5 }}
                  tracksViewChanges={tracking}
                  onPress={() => zoomInto(c)}
                  zIndex={3}
                >
                  <ClusterBubble count={c.ids.length} />
                </Marker>
              ) : (
                <Marker
                  key={`p-${c.id}`}
                  coordinate={c}
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={tracking}
                  onPress={() => selectPin(c.ids[0])}
                  zIndex={c.ids[0] === selected ? 4 : 2}
                >
                  <PricePin
                    label={offers[c.ids[0]] ? formatPrice(offers[c.ids[0]].priceVnd) : ' '}
                    selected={c.ids[0] === selected}
                    dimmed={(offers[c.ids[0]]?.remaining ?? 1) === 0}
                    delay={i * mapMotion.pinStagger}
                  />
                </Marker>
              ),
            )}
          </>
        ) : null}
      </MapView>

      {/* FloatingMapTopChrome */}
      <View style={[styles.search, { top: insets.top + 8 }]}>
        <SearchInputBar
          value="Khu học xá ĐH Đà Nẵng · Bán kính 1 km"
          onPressField={() => router.push('/discover/search')}
        />
      </View>
      <View style={[styles.chips, { top: insets.top + 64 }]}>
        <MapChip label="Bản đồ · 3" width={113} selected />
        <MapChip label="Danh sách" width={113} onPress={() => router.back()} />
        <MapChip label="Lọc" width={111} onPress={() => router.push('/discover/filters')} />
      </View>
      <View style={[styles.controls, { top: insets.top + 124 }]}>
        <MapControlGroup
          items={[
            {
              symbol: locating ? 'location.fill' : 'location',
              label: 'Vị trí của tôi',
              active: locating,
              onPress: () => {
                setLocating(true);
                map.current?.animateToRegion(
                  { ...USER_SPOT, latitudeDelta: 0.004, longitudeDelta: 0.004 },
                  mapMotion.camera,
                );
              },
            },
            {
              symbol: standard ? 'map.fill' : 'map',
              label: 'Kiểu bản đồ',
              active: standard,
              onPress: () => setStandard((v) => !v),
            },
          ]}
        />
      </View>

      <View
        style={[styles.sheetWrap, { bottom: bottomOffset, height: detents[2] }]}
        pointerEvents="box-none"
      >
        <DetentSheet
          detents={detents}
          index={index}
          onIndexChange={(i) => {
            setIndex(i);
            const pin = MAP_PINS.find((p) => p.offerId === selected);
            if (pin) focus(pin, i);
          }}
          floating={<MapDisclosure text="Vị trí và khoảng cách tham khảo" />}
          header={
            index === 0 ? null : (
              <Text variant="title20" style={styles.sheetTitle}>
                {`${MAP_PINS.length} món quanh trường`}
              </Text>
            )
          }
        >
          {({ scrollEnabled }) => (
            <ScrollView
              scrollEnabled={scrollEnabled}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetList}
              bounces={scrollEnabled}
            >
              {listed.map((id) => {
                const o = offers[id];
                if (!o) return null;
                return (
                  <Animated.View
                    key={id}
                    entering={FadeIn.duration(duration.base)}
                    exiting={FadeOut.duration(duration.fast)}
                  >
                    <OfferListRow
                      {...toRowProps(o)}
                      merchantLine={o.merchant.name}
                      availabilityLabel={formatTimeRange(o.pickupStart, o.pickupEnd)}
                      onPress={() =>
                        index === 0 || id === selected ? openOffer(id) : selectPin(id)
                      }
                    />
                  </Animated.View>
                );
              })}
            </ScrollView>
          )}
        </DetentSheet>
      </View>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceSubtle }, // #F4EFE6 while the map tiles load
  search: { position: 'absolute', left: 20, right: 20 },
  chips: { position: 'absolute', left: 20, flexDirection: 'row', gap: 8 },
  controls: { position: 'absolute', right: 20 },
  sheetWrap: { position: 'absolute', left: 16, right: 16 },
  sheetTitle: { paddingHorizontal: 16, paddingBottom: 8 },
  sheetList: { gap: 8, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 },
});
