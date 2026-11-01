import * as Haptics from 'expo-haptics';
import { ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { duration } from '@/design-system/motion';
import { colors, radius } from '@/design-system/tokens';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Props = {
  label: string;
  variant?: 'primary' | 'neutral' | 'subtle';
  onPress?: () => void;
  disabled?: boolean;
  /** Shows a spinner next to the label and ignores presses (confirm flows). Keeps the normal look. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * SDS Button (Figma: Variant Primary / Neutral / Subtle, Size Medium, State Default).
 * Radius pill (var radius-pill 999); Primary fill brand900 + inverse text; Neutral fill brand100 + brand900 text.
 * Heights from the layers: Primary 52, Neutral 50. Label size/weight and the disabled look are NOT exposed by
 * Figma (Code Connect) — estimated from screenshots; verify against the "Disabled · visual reference" (198:231).
 */
export function Button({ label, variant = 'primary', onPress, disabled, loading, style }: Props) {
  const isSubtle = variant === 'subtle';
  const labelColor =
    variant === 'primary'
      ? disabled
        ? 'textSecondary'
        : 'textInverse'
      : isSubtle
        ? 'textSecondary'
        : 'brand900';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={() => {
        if (!isSubtle) Haptics.selectionAsync();
        onPress?.();
      }}
      style={[
        styles.base,
        styles[variant],
        disabled && (variant === 'primary' ? styles.primaryDisabled : styles.disabled),
        style,
      ]}
    >
      {loading ? (
        <Animated.View
          entering={FadeIn.duration(duration.fast)}
          exiting={FadeOut.duration(duration.fast)}
          style={styles.spinner}
        >
          <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.brand900} />
        </Animated.View>
      ) : null}
      <Text variant={isSubtle ? 'buttonSubtle' : 'buttonLabel'} color={labelColor}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primary: { height: 52, borderRadius: radius.pill, backgroundColor: colors.brand900 },
  neutral: { height: 50, borderRadius: radius.pill, backgroundColor: colors.brand100 },
  subtle: { minWidth: 64, height: 48, alignSelf: 'auto', borderRadius: 8 },
  disabled: { opacity: 0.4 },
  // SB-006 "Create account · disabled until consent": beige pill + muted label (estimated from screenshot)
  primaryDisabled: { backgroundColor: colors.surfaceSubtle },
  spinner: { marginRight: 8 },
});
