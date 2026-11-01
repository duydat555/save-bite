import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { colors, layout, radius, spacing } from '@/design-system/tokens';

import { GlassButton } from './GlassButton';
import { Text } from './Text';

type Props = {
  placeholder: string;
  onPressSearch?: () => void;
  onPressFilter?: () => void;
};

/** Figma: "Search and filter" row — AppleKit Search Input (h36, subtle fill, r14) + 50pt filter button. */
export function SearchField({ placeholder, onPressSearch, onPressFilter }: Props) {
  return (
    <View style={styles.row}>
      <PressableScale accessibilityRole="search" onPress={onPressSearch} style={styles.input}>
        <SymbolView name="magnifyingglass" size={16} tintColor={colors.textSecondary} />
        <Text variant="searchPlaceholder" color="textSecondary">
          {placeholder}
        </Text>
      </PressableScale>
      <GlassButton
        symbol="slider.horizontal.3"
        accessibilityLabel="Bộ lọc"
        onPress={onPressFilter}
        size={layout.glassButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing[8], height: 48 },
  input: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[12],
    borderRadius: radius.input,
    backgroundColor: colors.surfaceSubtle,
  },
});
