import * as Haptics from 'expo-haptics';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/ui/GlassSurface';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

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

/** Floating map chip (113×44 glass pill). `selected` = solid brand900 with white label. */
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

/** Disclosure pill above the sheet (361×28): "Vị trí và khoảng cách tham khảo". */
export function MapDisclosure({ text }: { text: string }) {
  return (
    <View style={styles.disclosure} pointerEvents="none">
      <Text variant="meta">{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
