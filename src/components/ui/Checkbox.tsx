import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';

import { Text } from './Text';

type Props = { checked: boolean; onChange: (next: boolean) => void; label: string };

/**
 * SDS Checkbox Field with a 48pt touch surface and wrapping label (Figma "Consent · kit control + wrapping label").
 * Box size/border and the checked look are estimated from the unchecked screenshot. The fill cross-fades to
 * brand900 (UI thread) instead of switching instantly.
 */
export function Checkbox({ checked, onChange, label }: Props) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, {
      duration: reduced ? duration.fast : duration.base,
      easing: easing.standard,
    });
  }, [checked, reduced, progress]);

  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['rgba(0,67,55,0)', colors.brand900]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.inputText, colors.brand900]),
  }));
  const tick = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={styles.touch}>
        <Animated.View style={[styles.box, box]}>
          <Animated.View style={tick}>
            <SymbolView name="checkmark" size={11} tintColor={colors.white} weight="bold" />
          </Animated.View>
        </Animated.View>
      </View>
      <Text variant="linkMedium14" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 64 },
  touch: { width: 48, height: 48, marginTop: 8, alignItems: 'center', justifyContent: 'center' },
  box: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderWidth: 1.5,
  },
  label: { flex: 1, marginTop: 12, marginLeft: 12, lineHeight: 20 },
});
