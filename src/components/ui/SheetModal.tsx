/* Reanimated shared values are mutable by design; the React Compiler immutability rule does not apply here. */
/* eslint-disable react-hooks/immutability */
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

import { duration, easing, spring } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

type Props = {
  /** Total sheet height in the 393×852 frame, including the home-indicator zone. */
  height: number;
  /** Sheet fill (default canvas). SB-078 uses white. */
  fill?: string;
  children: (api: { dismiss: () => void; bottomInset: number }) => ReactNode;
};

/**
 * Bottom sheet for `transparentModal` routes. The previous screen stays visible under a dark scrim; the sheet rises
 * with a timing curve, can be dragged down to dismiss (pan on the sheet) or dismissed by tapping the scrim.
 * Figma: handle 36×4 at y=13, top radius 28, canvas fill. Scrim strength (0.3) is estimated from SB-036/037.
 */
export function SheetModal({ height, fill, children }: Props) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const total = height;
  const ty = useSharedValue(total);

  useEffect(() => {
    ty.value = reduced
      ? withTiming(0, { duration: duration.fast })
      : withTiming(0, { duration: duration.slow, easing: easing.enter });
  }, [reduced, ty, total]);

  const back = () => router.back();
  const dismiss = () => {
    ty.value = withTiming(
      total,
      { duration: duration.base, easing: Easing.in(Easing.cubic) },
      (done) => {
        if (done) runOnJS(back)();
      },
    );
  };

  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((e) => {
      ty.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 100 || e.velocityY > 900) {
        ty.value = withTiming(total, { duration: duration.base }, (done) => {
          if (done) runOnJS(back)();
        });
      } else {
        ty.value = withSpring(0, spring.snappy);
      }
    });

  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  const scrim = useAnimatedStyle(() => ({
    opacity: interpolate(ty.value, [0, total], [0.3, 0], 'clamp'),
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrim]} />
      <Pressable accessibilityLabel="Đóng" style={StyleSheet.absoluteFill} onPress={dismiss} />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.sheet, { height }, fill ? { backgroundColor: fill } : null, sheet]}
        >
          <View style={styles.handle} />
          {children({ dismiss, bottomInset: insets.bottom })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { backgroundColor: '#000' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
    overflow: 'hidden',
  },
  handle: {
    position: 'absolute',
    top: 13,
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.dotInactive,
  },
});
