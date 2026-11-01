import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { SvgIcon } from './SvgIcon';

type Props = { animated?: boolean };

const LEAF_X = [0, 32, 64]; // figma: Seed 0/1/2 at 0, 33.3%, 66.7% of 96
const PHASE_MS = 450;

/**
 * Brand/SeedActivity (Theme=Cream): three leaves, indeterminate. Phase 1 = first leaf full, others 24%.
 * Animates through 3 phases; `animated={false}` is the Static fallback. Never represents measured progress.
 */
export function SeedActivity({ animated = true }: Props) {
  const phase = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    const id = setInterval(() => {
      phase.value = (phase.value + 1) % 3;
    }, PHASE_MS);
    return () => clearInterval(id);
  }, [animated, phase]);

  return (
    <View style={styles.box} accessibilityLabel="Đang tải">
      {LEAF_X.map((x, i) => (
        <Leaf key={x} left={x} index={i} phase={phase} />
      ))}
    </View>
  );
}

function Leaf({ left, index, phase }: { left: number; index: number; phase: { value: number } }) {
  const style = useAnimatedStyle(() => ({
    opacity: withTiming(phase.value === index ? 1 : 0.24, { duration: 250 }),
  }));
  return (
    <Animated.View style={[styles.leaf, { left }, style]}>
      <SvgIcon name="seed-0" size={24} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { width: 96, height: 24 },
  leaf: { position: 'absolute', top: 0, width: 24, height: 24 },
});
