import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { duration, easing, mapMotion } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

/**
 * Price / pickup pin (Marker child). Figma MapPricePin: brand900 pill 88×43 with a white rim and white label, selected =
 * Rescue Price fill (SB-039 / SB-065 "Điểm nhận" uses the selected colour). Added for the native map: a small tail
 * anchoring the pin, two soft shadow layers, tabular digits, a staggered scale-in (`delay`) and a spring to ×1.12 when
 * selected. `dimmed` (sold out) fades to 0.5.
 */
export function PricePin({
  label,
  selected,
  dimmed,
  delay = 0,
}: {
  label: string;
  selected: boolean;
  dimmed?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const appear = useSharedValue(0);
  const lift = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    appear.value = withDelay(
      delay,
      withTiming(1, {
        duration: reduced ? duration.fast : mapMotion.pinIn,
        easing: easing.enter,
      }),
    );
  }, [appear, delay, reduced]);
  useEffect(() => {
    lift.value = reduced
      ? withTiming(selected ? 1 : 0, { duration: duration.fast })
      : withSpring(selected ? 1 : 0, mapMotion.pin);
  }, [selected, reduced, lift]);

  const style = useAnimatedStyle(() => ({
    opacity: appear.value * (dimmed ? 0.5 : 1),
    transform: [
      { translateY: reduced ? 0 : (1 - appear.value) * 6 },
      {
        scale:
          (reduced ? 1 : 0.6 + appear.value * 0.4) *
          (reduced ? 1 : 1 + lift.value * (mapMotion.selectedScale - 1)),
      },
    ],
  }));
  const fill = selected ? colors.price : colors.brand900;

  return (
    <Animated.View collapsable={false} style={[styles.pinBox, style]}>
      <View style={styles.pinAmbient}>
        <View
          style={[styles.pinPill, { backgroundColor: fill }, selected && styles.pinPillSelected]}
        >
          <Text variant="bold14" color="white" style={styles.tabular}>
            {label}
          </Text>
        </View>
      </View>
      <View style={[styles.tail, { borderTopColor: fill }]} />
    </Animated.View>
  );
}

/** Cluster bubble: round brand900 disc with the count and a white rim (tap zooms into the group). */
export function ClusterBubble({ count }: { count: number }) {
  return (
    <View collapsable={false} style={styles.clusterBox}>
      <View style={styles.cluster}>
        <Text variant="bold15" color="white" style={styles.tabular}>
          {count}
        </Text>
      </View>
    </View>
  );
}

/** Apple-style user dot: blue disc with a white rim and a soft halo that pulses. Static under Reduce Motion. */
export function UserDot() {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: easing.enter }), -1, false);
    return () => cancelAnimation(pulse);
  }, [pulse, reduced]);
  const halo = useAnimatedStyle(() => ({
    opacity: reduced ? 0.25 : 0.35 * (1 - pulse.value),
    transform: [{ scale: reduced ? 1 : 0.6 + pulse.value * 1.2 }],
  }));
  return (
    <View collapsable={false} style={styles.userBox}>
      <Animated.View style={[styles.userHalo, halo]} />
      <View style={styles.userDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabular: { fontVariant: ['tabular-nums'] },
  pinBox: { width: 100, height: 56, alignItems: 'center', justifyContent: 'flex-start' },
  // two soft shadow layers: a 1pt contact shadow on the rim, a wide ambient one on this wrapper
  pinAmbient: {
    borderRadius: 22,
    borderCurve: 'continuous',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  pinPill: {
    width: 88,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  pinPillSelected: { shadowOpacity: 0.2, shadowRadius: 3 },
  tail: {
    width: 0,
    height: 0,
    marginTop: -1,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  clusterBox: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  cluster: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: colors.white,
    backgroundColor: colors.brand900,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  userBox: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  userHalo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A84FF',
  },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: '#0A84FF',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});
