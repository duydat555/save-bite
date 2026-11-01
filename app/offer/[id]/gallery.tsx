import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/ui/GlassSurface';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { duration, spring } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';
import { useOffer } from '@/features/offer/useOffer';

// SB-035 · Thư viện ảnh món ăn · Photo Gallery (full-screen dark viewer). "Vừa khung" fits the photo, "Cận cảnh"
// zooms in (scale 1.7, spring). The image band is 393×263 at y=209 in the frame.
export default function Gallery() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const offer = useOffer(id);
  const reduced = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const scale = useSharedValue(1);

  const setZoom = (z: boolean) => {
    setZoomed(z);
    scale.value = reduced
      ? withTiming(z ? 1.7 : 1, { duration: duration.fast })
      : withSpring(z ? 1.7 : 1, spring.snappy);
  };
  const photo = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { top: insets.top + 3 }]}>
        <Text variant="bold13" color="white">
          Ảnh món · Minh họa
        </Text>
        <PressableScale accessibilityRole="button" onPress={() => router.back()}>
          <GlassSurface variant="pill" style={styles.close}>
            <Text variant="action17">Đóng</Text>
          </GlassSurface>
        </PressableScale>
      </View>

      <View style={[styles.band, { top: insets.top + 150, width }]}>
        {offer ? (
          <Animated.View style={[StyleSheet.absoluteFill, photo]}>
            <Image source={offer.image} contentFit="cover" style={StyleSheet.absoluteFill} />
          </Animated.View>
        ) : null}
      </View>

      <View style={[styles.caption, { top: insets.top + 523 }]}>
        <Text variant="title20" color="white">
          {offer?.title ?? ' '}
        </Text>
        <Text variant="bodyLg" color="white" style={styles.note}>
          Ảnh minh họa. Món nhận thực tế có thể khác; hình ảnh không xác nhận thành phần hoặc dị
          ứng.
        </Text>
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setZoom(false)}
            style={[styles.pill, !zoomed ? styles.pillOn : styles.pillOff]}
          >
            <Text variant="semi14" color={!zoomed ? 'brand900' : 'white'}>
              Vừa khung
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setZoom(true)}
            style={[styles.pill, zoomed ? styles.pillOn : styles.pillOff]}
          >
            <Text variant="semi14" color={zoomed ? 'brand900' : 'white'}>
              Cận cảnh
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand900 },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: { width: 80, height: 46 },
  band: { position: 'absolute', left: 0, height: 263, overflow: 'hidden' },
  caption: { position: 'absolute', left: 20, right: 20 },
  note: { marginTop: 12, lineHeight: 22, opacity: 0.92 },
  row: { flexDirection: 'row', gap: 13, marginTop: 28 },
  pill: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  pillOn: { backgroundColor: colors.brand100 },
  pillOff: { borderWidth: 1, borderColor: colors.white },
});
