import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { colors, radius, spacing } from '@/design-system/tokens';

import { Text } from './Text';

type Props = {
  label: string;
  icon: ReactNode;
  selected?: boolean;
  onPress?: () => void;
};

/** Figma CategoryTile 82×64: Selected = brand900 fill / canvas text; Default = subtle fill. */
export function CategoryTile({ label, icon, selected = false, onPress }: Props) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.tile, selected ? styles.selected : styles.default]}
    >
      {icon}
      <Text variant="tileLabel" color={selected ? 'canvas' : 'textPrimary'}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 82,
    height: 64,
    padding: spacing[8],
    gap: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.tile,
  },
  selected: { backgroundColor: colors.brand900 },
  default: { backgroundColor: colors.surfaceSubtle },
});
