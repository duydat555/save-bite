import { StyleSheet, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { SheetModal } from '@/components/ui/SheetModal';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, categoryOrder } from '@/constants/pantry';
import { colors, radius } from '@/design-system/tokens';
import { usePantryDraft } from '@/store/pantryDraft';

// SB-078 · Chọn loại thực phẩm · Sheet (8 category tiles, 2 columns). Sheet top at y=192 → 660 high.
export default function PantryCategorySheet() {
  const { draft, set } = usePantryDraft();
  return (
    <SheetModal height={660} fill={colors.white}>
      {({ dismiss }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ color: colors.black }}>
              Chọn loại thực phẩm
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={styles.grid}>
            {categoryOrder.map((c) => {
              const selected = draft.category === c;
              return (
                <PressableScale
                  key={c}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    set({ category: c });
                    dismiss();
                  }}
                  style={[styles.tile, selected ? styles.on : styles.off]}
                >
                  <SvgIcon
                    name={categoryMeta[c].icon}
                    size={32}
                    tint={selected ? colors.canvas : undefined}
                  />
                  <Text
                    variant="semi13"
                    color={selected ? 'canvas' : 'textPrimary'}
                    style={{ width: 144, textAlign: 'center' }}
                  >
                    {categoryMeta[c].label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 30 }, // handle row 12 + gap 14 from sheet top 14
  head: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 12, marginTop: 14 },
  tile: {
    width: 168,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: radius.input,
  },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
});
