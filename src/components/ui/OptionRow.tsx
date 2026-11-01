import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system/tokens';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Props = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
};

/** Selectable sheet row (SB-024/025/026/027): selected = brand900 fill + white text + checkmark; else outlined on canvas. */
export function OptionRow({ title, subtitle, selected = false, onPress }: Props) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.row, selected ? styles.on : styles.off, subtitle ? styles.tall : null]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="semi14" color={selected ? 'white' : 'textPrimary'} style={{ fontSize: 15 }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="meta" style={{ color: selected ? colors.brand100 : colors.textSecondary }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <SymbolView name="checkmark" size={16} weight="semibold" tintColor={colors.white} />
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.tile,
  },
  tall: { height: 60 },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
});
