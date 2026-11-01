import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/design-system/tokens';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  height?: number;
  /** Corner radius (default pill). Pantry forms use r14 (`radius-sm`). */
  corner?: number;
  /** Label style: 'semi14' (default) or 'semi13' (Pantry forms: Be Vietnam Pro SemiBold 13/19). */
  labelVariant?: 'semi14' | 'semi13';
  style?: StyleProp<ViewStyle>;
};

/** Pill choice (SB-077 storage / quantity, SB-085 / SB-094 chips): selected = brand900 fill, else outline on canvas. */
export function Choice({
  label,
  selected,
  onPress,
  height = 52,
  corner,
  labelVariant = 'semi14',
  style,
}: Props) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.base,
        { height },
        corner != null && { borderRadius: corner },
        selected ? styles.on : styles.off,
        style,
      ]}
    >
      <Text variant={labelVariant} color={selected ? 'canvas' : 'textPrimary'}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
});
