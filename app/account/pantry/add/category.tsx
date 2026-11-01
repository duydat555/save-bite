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
    <SheetModal height={660}>
      {({ dismiss }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="bold15" style={{ fontSize: 20, lineHeight: 26 }}>
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
                    tint={selected ? colors.white : undefined}
                  />
                  <Text variant="semi14" color={selected ? 'white' : 'textPrimary'}>
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 34 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 13, marginTop: 20 },
  tile: {
    width: 168,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: radius.tile,
  },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
});
