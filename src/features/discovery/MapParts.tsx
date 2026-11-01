import * as Haptics from 'expo-haptics';
import { SymbolView, type SFSymbol } from 'expo-symbols';
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

import { GlassSurface } from '@/components/ui/GlassSurface';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { duration, easing, mapMotion } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';

/**
 * Price pin for the real map (Marker child). Figma MapPricePin: brand900 pill 88×43 with a white rim and white price,
 * selected = Rescue Price fill. Added for the native map: a small tail anchoring the pin, two soft shadow layers, tabular
 * digits, a staggered scale-in (`delay`) and a spring to ×1.12 when selected. `dimmed` (sold out) fades to 0.5.
 */
export function PricePin({
  label,
  selected,
  dimmed,
  delay,
}: {
  label: string;
  selected: boolean;
  dimmed?: boolean;
  delay: number;
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

/** Vertical Liquid Glass control group (Apple Maps): 46pt buttons separated by a hairline. */
export function MapControlGroup({
  items,
}: {
  items: { symbol: SFSymbol; label: string; active?: boolean; onPress: () => void }[];
}) {
  return (
    <GlassSurface variant="bar" radius={23} style={{ width: 46, height: items.length * 46 }}>
      <View style={{ flex: 1 }}>
        {items.map((it, i) => (
          <PressableScale
            key={it.label}
            accessibilityRole="button"
            accessibilityLabel={it.label}
            accessibilityState={{ selected: !!it.active }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              it.onPress();
            }}
            style={[styles.ctrl, i > 0 && styles.ctrlRule]}
          >
            <SymbolView
              name={it.symbol}
              size={19}
              weight="medium"
              tintColor={it.active ? colors.brand900 : colors.textPrimary}
            />
          </PressableScale>
        ))}
      </View>
    </GlassSurface>
  );
}

/* Floating map chip (113×44 glass pill). `selected` = solid brand900 with white label. */
export function MapChip({
  label,
  selected,
  width,
  onPress,
}: {
  label: string;
  selected?: boolean;
  width: number;
  onPress?: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={{ width, height: 44 }}
    >
      {selected ? (
        <View style={[styles.chipSolid, { width, height: 44 }]}>
          <Text variant="semi14" color="white">
            {label}
          </Text>
        </View>
      ) : (
        <GlassSurface variant="pill" style={{ width, height: 44 }} interactive>
          <Text variant="semi14">{label}</Text>
        </GlassSurface>
      )}
    </PressableScale>
  );
}

/* Disclosure pill above the sheet (361×28). */
export function MapDisclosure({ text }: { text: string }) {
  return (
    <View style={styles.disclosure} pointerEvents="none">
      <Text variant="meta">{text}</Text>
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
  ctrl: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  ctrlRule: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(9,47,41,0.18)' },
  chipSolid: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand900,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  disclosure: {
    width: 361,
    height: 28,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: 'rgba(255,252,246,0.92)',
  },
});
