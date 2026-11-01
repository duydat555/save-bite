import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { colors, radius } from '@/design-system/tokens';

type Props = {
  count: number;
  index: number;
  activeWidth?: number;
  activeColor?: string;
  inactiveColor?: string;
};

/** Figma PageDots: 6pt dots, gap 6, active dot is a pill (20 on SB-003/004, 24 on SB-002). Static version. */
export function PageDots({
  count,
  index,
  activeWidth = 20,
  activeColor = colors.brand900,
  inactiveColor = colors.borderDefault,
}: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index
              ? { width: activeWidth, backgroundColor: activeColor }
              : { width: 6, backgroundColor: inactiveColor },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Scroll-driven dots for the onboarding pager: each dot stretches into the pill / shrinks back as the page offset
 * moves (width + colour interpolated on the UI thread). At rest it matches the static Figma frames exactly:
 * page 1 → 24pt active + #D5CEC2 inactive; pages 2–3 → 20pt active + border-default inactive.
 */
export function AnimatedPageDots({
  count,
  scrollX,
  pageWidth,
}: {
  count: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} i={i} scrollX={scrollX} pageWidth={pageWidth} />
      ))}
    </View>
  );
}

function Dot({
  i,
  scrollX,
  pageWidth,
}: {
  i: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
}) {
  const style = useAnimatedStyle(() => {
    const position = scrollX.value / pageWidth;
    const near = Math.max(0, 1 - Math.abs(position - i));
    const active = i === 0 ? 24 : 20;
    const inactive = interpolateColor(
      Math.min(Math.max(position, 0), 1),
      [0, 1],
      [colors.dotInactive, colors.borderDefault],
    );
    return {
      width: 6 + (active - 6) * near,
      backgroundColor: interpolateColor(near, [0, 1], [inactive, colors.brand900]),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dot: { height: 6, borderRadius: radius.pill },
});
