import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { duration, spring } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';

import { Text } from './Text';

type Props = { tabs: string[]; index: number; onChange: (index: number) => void };

const GAP = 4;
const PAD = 3;

/**
 * Figma SegmentedControl (353×44): subtle pill track, p3 gap4, active segment = white pill + SemiBold 14.
 * The white thumb slides to the new segment with a spring (translateX on the UI thread).
 */
export function SegmentedControl({ tabs, index, onChange }: Props) {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const segment = width > 0 ? (width - PAD * 2 - GAP * (tabs.length - 1)) / tabs.length : 0;
  const x = useSharedValue(0);

  useEffect(() => {
    const target = index * (segment + GAP);
    x.value = reduced
      ? withTiming(target, { duration: duration.fast })
      : withSpring(target, spring.snappy);
  }, [index, segment, reduced, x]);

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      style={styles.track}
      accessibilityRole="tablist"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {segment > 0 ? <Animated.View style={[styles.thumb, { width: segment }, thumb]} /> : null}
      {tabs.map((label, i) => {
        const active = i === index;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(i)}
            style={styles.tab}
          >
            <Text
              variant={active ? 'segActive' : 'segInactive'}
              color={active ? 'textPrimary' : 'textSecondary'}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
    padding: PAD,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSubtle,
  },
  thumb: {
    position: 'absolute',
    left: PAD,
    top: PAD,
    bottom: PAD,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  tab: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
});
