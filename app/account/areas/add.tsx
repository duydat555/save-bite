import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { InputField } from '@/components/ui/InputField';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { spring } from '@/design-system/motion';
import { colors, layout, radius } from '@/design-system/tokens';
import { useAccountStore } from '@/store/accountStore';
import type { SavedArea } from '@/types';

// SB-094 · Lưu khu vực. Map preview 353×270 r20; radius illustration 152×152 at (100.5,59) for 1 km; pin 24 at (164.5,123).
// Only the 1 km illustration exists in Figma → 500 m / 2 km scale it (0.5× / 1.6×, ESTIMATE; 2 km capped by the map height).
const RADII: { label: string; m: SavedArea['radiusM']; scale: number }[] = [
  { label: '500 m', m: 500, scale: 0.5 },
  { label: '1 km', m: 1000, scale: 1 },
  { label: '2 km', m: 2000, scale: 1.6 },
];

export default function AddArea() {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const addArea = useAccountStore((s) => s.addArea);
  const [radiusM, setRadiusM] = useState<SavedArea['radiusM']>(1000);
  const [name, setName] = useState('Trường học');
  const cur = RADII.find((r) => r.m === radiusM) ?? RADII[1];

  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = reduce ? cur.scale : withSpring(cur.scale, spring.snappy);
  }, [cur.scale, reduce, scale]);
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Lưu khu vực" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.map}>
          <Image
            source={require('@assets/images/account/map-canvas.png')}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.ring, ring]}>
            <Image
              source={require('@assets/images/account/radius-1000.png')}
              style={{ width: 152, height: 152 }}
            />
          </Animated.View>
          <View style={styles.pin}>
            <SvgIcon name="map-pin" size={24} />
          </View>
        </View>
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
              onPress={() => setRadiusM(r.m)}
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
  ring: { position: 'absolute', left: 100.5, top: 59, width: 152, height: 152 },
  pin: { position: 'absolute', left: 164.5, top: 123 },
  row: { flexDirection: 'row', gap: 12 },
  dock: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
