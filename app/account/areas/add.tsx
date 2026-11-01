import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type MapView from 'react-native-maps';
import { Circle } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppMap } from '@/components/features/MapView';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { InputField } from '@/components/ui/InputField';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { CAMPUS } from '@/data/mock/mapPins';
import { mapMotion } from '@/design-system/motion';
import { colors, layout, radius } from '@/design-system/tokens';
import { useAccountStore } from '@/store/accountStore';
import type { SavedArea } from '@/types';

// SB-094 · Lưu khu vực. Real map card 353×270 r20 (AppMap `card`: tap once to enable gestures), pin 24 at (164.5,123),
// dashed Circle with the real radius (500 m / 1 km / 2 km). Figma's 1 km illustration is 152pt wide → the camera keeps the
// circle at that size for every radius.
const RADII: { label: string; m: SavedArea['radiusM'] }[] = [
  { label: '500 m', m: 500 },
  { label: '1 km', m: 1000 },
  { label: '2 km', m: 2000 },
];

// The circle is the real radius (Circle, in metres). The camera zooms so the circle always spans ~43% of the card width
// (152 of 353 — the Figma 1 km illustration): 1° of longitude ≈ 107 km at this latitude.
const deltaFor = (m: number) => {
  const d = ((m * 2) / 1000 / 0.43 / 107) * 1;
  return { latitudeDelta: d, longitudeDelta: d };
};

export default function AddArea() {
  const insets = useSafeAreaInsets();
  const addArea = useAccountStore((s) => s.addArea);
  const [radiusM, setRadiusM] = useState<SavedArea['radiusM']>(1000);
  const [name, setName] = useState('Trường học');
  const cur = RADII.find((r) => r.m === radiusM) ?? RADII[1];
  const map = useRef<MapView>(null);
  const [center, setCenter] = useState(CAMPUS);

  const pickRadius = (m: SavedArea['radiusM']) => {
    setRadiusM(m);
    map.current?.animateToRegion({ ...center, ...deltaFor(m) }, mapMotion.camera);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Lưu khu vực" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <AppMap
          ref={map}
          mode="card"
          style={styles.map}
          region={{ ...center, ...deltaFor(radiusM) }}
          onRegionChangeComplete={(r) =>
            setCenter({ latitude: r.latitude, longitude: r.longitude })
          }
          overlay={
            <View style={styles.pin} pointerEvents="none">
              <SvgIcon name="map-pin" size={24} />
            </View>
          }
        >
          <Circle
            center={center}
            radius={radiusM}
            strokeColor={colors.brand900}
            strokeWidth={1.5}
            lineDashPattern={[6, 6]}
            fillColor="rgba(0,67,55,0.10)"
          />
        </AppMap>
        <Text variant="title20" style={{ letterSpacing: -0.2 }}>
          Khu vực quanh trường
        </Text>
        <View style={styles.row}>
          {RADII.map((r) => (
            <Choice
              key={r.m}
              label={r.label}
              height={48}
              selected={radiusM === r.m}
              onPress={() => pickRadius(r.m)}
            />
          ))}
        </View>
        <Text variant="captionMeta" color="textSecondary">{`Bán kính ${cur.label}`}</Text>
        <InputField label="Tên khu vực" value={name} onChangeText={setName} />
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
          Tâm là khu vực bạn chọn, không phải vị trí GPS. Vòng tròn minh họa phạm vi tìm món.
        </Text>
      </ScrollView>
      <View style={[styles.dock, { bottom: insets.bottom + 20 }]}>
        <Button
          label="Lưu khu vực"
          onPress={() => {
            addArea({
              name: name.trim() || 'Khu vực mới',
              district: 'Quận Liên Chiểu, Đà Nẵng',
              radiusM,
            });
            router.back();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  map: { height: 270, overflow: 'hidden', borderRadius: radius.md },
  pin: { position: 'absolute', left: 164.5, top: 123 },
  row: { flexDirection: 'row', gap: 12 },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
