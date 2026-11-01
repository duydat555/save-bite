import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { easing } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

type Props = {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Placeholder block shown while the mock repository "loads" (200–500 ms). Gentle opacity pulse on the UI thread
 * (shimmer without a gradient sweep keeps it cheap); static under Reduce Motion. Uses the subtle surface colour.
 */
export function Skeleton({ width = '100%', height, radius = 12, style }: Props) {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 700, easing: easing.standard }),
        withTiming(1, { duration: 700, easing: easing.standard }),
      ),
      -1,
    );
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);

  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.surfaceSubtle },
        animated,
        style,
      ]}
    />
  );
}
