import * as Haptics from 'expo-haptics';
import { forwardRef, useMemo, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { type EdgePadding, type Region } from 'react-native-maps';

import { colors } from '@/design-system/tokens';

/**
 * The one real map of the app (Apple Maps through react-native-maps, available in Expo Go). Every map area — full screen,
 * card, onboarding preview — is this component; only `mode` and the props differ.
 *
 *  - `full`    : whole-screen map, fully interactive (pan / pinch / double-tap). SB-016, SB-039, SB-065.
 *  - `card`    : rounded card inside a vertical ScrollView. Pinch / double-tap zoom always work; one-finger panning is OFF
 *                until the user taps the map once, so scrolling the page is never hijacked. SB-032, SB-094.
 *  - `preview` : real map but no gestures at all (and not even touchable), for pager / decorative areas that must keep
 *                their own swipes. SB-003, SB-011.
 * Style: muted standard, no POI / compass / scale / buildings / traffic, light interface, canvas-tinted loading colour.
 * Children (markers, circles) are mounted after `onMapReady` so nothing flashes while tiles load.
 */
type Props = {
  mode: 'full' | 'card' | 'preview';
  region: Region;
  style?: StyleProp<ViewStyle>;
  mapPadding?: EdgePadding;
  mapType?: 'standard' | 'mutedStandard';
  onRegionChangeComplete?: (r: Region) => void;
  onMapReady?: () => void;
  /** Rendered inside the map once it is ready. */
  children?: ReactNode;
  /** Absolutely positioned overlays drawn above the map (labels, pills). */
  overlay?: ReactNode;
};

export const AppMap = forwardRef<MapView, Props>(function AppMap(
  {
    mode,
    region,
    style,
    mapPadding,
    mapType = 'mutedStandard',
    onRegionChangeComplete,
    onMapReady,
    children,
    overlay,
  },
  ref,
) {
  const [ready, setReady] = useState(false);
  // Native props must be referentially stable: a fresh `mapPadding` / `initialRegion` object on every re-render (e.g. after
  // each onRegionChangeComplete) makes the native map re-apply insets/region and undoes the user's pinch-zoom.
  const initial = useRef(region).current;
  const padding = useMemo(
    () => mapPadding,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapPadding?.top, mapPadding?.right, mapPadding?.bottom, mapPadding?.left],
  );
  const [active, setActive] = useState(false);
  const pan = mode === 'full' || (mode === 'card' && active);
  // cards: pinch / double-tap zoom always work; one-finger panning (which would fight the page scroll) turns on after a tap
  const zoom = mode !== 'preview';
  const flat = mode !== 'full'; // cards / previews clip to the rounded container

  return (
    <View style={[styles.wrap, flat && styles.flat, style]}>
      <MapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        initialRegion={initial}
        mapType={mapType}
        userInterfaceStyle="light"
        showsPointsOfInterests={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsUserLocation={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={pan}
        zoomEnabled={zoom}
        zoomTapEnabled={zoom}
        onPress={() => {
          if (mode === 'card' && !active) {
            Haptics.selectionAsync();
            setActive(true);
          }
        }}
        mapPadding={padding}
        pointerEvents={mode === 'preview' ? 'none' : 'auto'}
        onMapReady={() => {
          setReady(true);
          onMapReady?.();
        }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {ready ? children : null}
      </MapView>
      {overlay}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.surfaceSubtle, overflow: 'hidden' }, // #F4EFE6 while tiles load
  flat: { borderCurve: 'continuous' },
});
