/* Reanimated shared values are mutable by design; the React Compiler immutability rule does not apply here. */

import * as Haptics from 'expo-haptics';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { duration, mapMotion } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

type Props = {
  /** Visible heights (pt) for each detent, ascending: e.g. [152, 420, 700]. */
  detents: number[];
  index: number;
  onIndexChange: (i: number) => void;
  /** Called continuously on the UI thread would be costly — only the settled visible height is reported. */
  onSettled?: (height: number) => void;
  /** Rendered above the sheet and moving with it (e.g. the disclosure pill). Fades once the sheet leaves detent 0. */
  floating?: ReactNode;
  /** Area that also drags the sheet (header). */
  header?: ReactNode;
  /** Body: scrolls only at the last detent, otherwise it drags the sheet. */
  children: (api: { scrollEnabled: boolean }) => ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Apple-Maps-style bottom sheet with detents. The sheet has a fixed height (the last detent) and is translated;
 * dragging follows the finger, releasing snaps to the nearest detent in the direction of the fling with a spring,
 * and there is rubber-band resistance past the first / last detent. Grabber 36×5. Reduce Motion → timing, no overshoot.
 */
export function DetentSheet({
  detents,
  index,
  onIndexChange,
  onSettled,
  floating,
  header,
  children,
  style,
}: Props) {
  const reduced = useReducedMotion();
  const max = detents[detents.length - 1];
  // translateY of each detent (0 = fully open)
  const stops = detents.map((h) => max - h);
  const ty = useSharedValue(stops[index]);
  const start = useSharedValue(stops[index]);

  const go = (i: number) => {
    const target = stops[i];
    ty.value = reduced
      ? withTiming(target, { duration: duration.base })
      : withSpring(target, mapMotion.sheet);
  };

  // follow `index` changes made by the parent (pin tapped → first detent)
  useEffect(() => {
    go(index);
    onSettled?.(detents[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const settle = (i: number) => {
    Haptics.selectionAsync();
    onIndexChange(i);
  };

  const makePan = () =>
    Gesture.Pan()
      .activeOffsetY([-8, 8])
      .failOffsetX([-24, 24])
      .onStart(() => {
        start.value = ty.value;
      })
      .onUpdate((e) => {
        let v = start.value + e.translationY;
        const top = stops[stops.length - 1]; // smallest translate (fully open) = 0
        const bottom = stops[0]; // largest translate (first detent)
        if (v < top) v = top + (v - top) * mapMotion.rubber;
        if (v > bottom) v = bottom + (v - bottom) * mapMotion.rubber;
        ty.value = v;
      })
      .onEnd((e) => {
        // project where the sheet would land with the release velocity, then pick the nearest stop
        const projected = ty.value + e.velocityY * 0.18;
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < stops.length; i++) {
          const d = Math.abs(stops[i] - projected);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        ty.value = reduced
          ? withTiming(stops[best], { duration: duration.base })
          : withSpring(stops[best], { ...mapMotion.sheet, velocity: e.velocityY });
        runOnJS(settle)(best);
      });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));
  const floatingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ty.value, [stops[0], stops[0] - 40], [1, 0], 'clamp'),
  }));

  const atTop = index === detents.length - 1;

  return (
    <Animated.View style={[styles.sheet, { height: max }, style, sheetStyle]}>
      {floating ? (
        <Animated.View style={[styles.floating, floatingStyle]} pointerEvents="none">
          {floating}
        </Animated.View>
      ) : null}
      <GestureDetector gesture={makePan()}>
        <View collapsable={false}>
          <View style={styles.grabberWrap}>
            <View style={styles.grabber} />
          </View>
          {header}
        </View>
      </GestureDetector>
      {atTop ? (
        <View style={{ flex: 1 }}>{children({ scrollEnabled: true })}</View>
      ) : (
        <GestureDetector gesture={makePan()}>
          <View style={{ flex: 1 }} collapsable={false}>
            {children({ scrollEnabled: false })}
          </View>
        </GestureDetector>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 28,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
    // two soft layers pointing upwards
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
  },
  floating: { position: 'absolute', left: 0, right: 0, top: -38 },
  grabberWrap: { height: 22, alignItems: 'center', justifyContent: 'center' },
  grabber: { width: 36, height: 5, borderRadius: 2.5, backgroundColor: colors.dotInactive },
});
