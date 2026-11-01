import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { GlassSurface } from '@/components/ui/GlassSurface';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { duration, spring } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';

/* MapPricePin (88×43): price pill with a white rim; selected = Rescue Price fill, others brand900. */
export function MapPricePin({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style: object;
}) {
  const reduced = useReducedMotion();
  const lift = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    lift.value = reduced
      ? withTiming(selected ? 1 : 0, { duration: duration.fast })
      : withSpring(selected ? 1 : 0, spring.bounce);
  }, [selected, reduced, lift]);
  const scale = useAnimatedStyle(() => ({ transform: [{ scale: 1 + lift.value * 0.08 }] }));

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Giá ${label}`}
      onPress={onPress}
      style={[styles.pinHit, style]}
    >
      <Animated.View
        style={[styles.pin, { backgroundColor: selected ? colors.price : colors.brand900 }, scale]}
      >
        <Text variant="bold14" color="white">
          {label}
        </Text>
      </Animated.View>
    </PressableScale>
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

/* MapPeekSheet (361×152): handle + a list row of the selected pin's offer. */
export function PeekSheetFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <View style={{ marginTop: 14 }}>{children}</View>
    </View>
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
  pinHit: {
    position: 'absolute',
    width: 88,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 88,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
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
  sheet: {
    width: 361,
    height: 152,
    paddingHorizontal: 17,
    paddingTop: 13,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.dotInactive },
  disclosure: {
    width: 361,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: 'rgba(255,252,246,0.92)',
  },
});
