import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

type Props = { value: boolean; onChange: (v: boolean) => void; accessibilityLabel: string };

// SB-085 / SB-097 switch. Geometry (52×30, 24pt knob) and the off-track grey are estimated from the screenshot.
const W = 52;
const H = 30;
const KNOB = 22;
const OFF_TRACK = '#C9C9C9'; // estimate

export function Toggle({ value, onChange, accessibilityLabel }: Props) {
  const reduce = useReducedMotion();
  const p = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    p.value = reduce
      ? value
        ? 1
        : 0
      : withTiming(value ? 1 : 0, { duration: duration.fast, easing: easing.standard });
  }, [value, reduce, p]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [OFF_TRACK, colors.brand700]),
    borderColor: interpolateColor(p.value, [0, 1], [colors.borderControl, colors.brand700]),
  }));
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: p.value * (W - KNOB - 8) }] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => {
        Haptics.selectionAsync();
        onChange(!value);
      }}
    >
      <Animated.View style={[styles.track, track]}>
        <Animated.View style={[styles.knob, knob]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: W,
    height: H,
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderRadius: H / 2,
    borderWidth: 1,
  },
  knob: { width: KNOB, height: KNOB, borderRadius: KNOB / 2, backgroundColor: colors.white },
});
