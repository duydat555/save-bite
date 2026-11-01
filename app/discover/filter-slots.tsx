import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { OptionRow } from '@/components/ui/OptionRow';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { useFilters } from '@/store/filterStore';

// SB-025 · Lọc thời gian nhận (sheet, top ≈ y366 → 486 high). Copy is literal from Figma.
const SLOTS = [
  { start: '16:00', end: '17:30', sub: 'Quầy Rau C · Rau củ hữu cơ (30K)' },
  { start: '17:00', end: '18:00', sub: 'Tiệm Bánh A · Bánh mì men (25K)' },
  { start: '17:30', end: '19:00', sub: 'Bếp Xanh Campus · Cơm trưa (35K)' },
  { start: '18:00', end: '19:00', sub: 'Tiệm Bánh A · Túi bất ngờ (29K)' },
];

export default function SlotsSheet() {
  const slot = useFilters((s) => s.slot);
  const set = useFilters((s) => s.set);
  const [value, setValue] = useState(slot?.start ?? null);
  return (
    <SheetModal height={486}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ flex: 1 }}>
              Giờ có thể nhận
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={{ gap: 8 }}>
            {SLOTS.map((s) => (
              <OptionRow
                key={s.start + s.end}
                title={`${s.start} – ${s.end}`}
                subtitle={s.sub}
                selected={value === s.start}
                onPress={() => setValue(s.start)}
              />
            ))}
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <Button
              label="Lưu khung giờ"
              onPress={() => {
                const s = SLOTS.find((x) => x.start === value);
                set({ slot: s ? { start: s.start, end: s.end } : null });
                dismiss();
              }}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cta: { position: 'absolute', left: 20, right: 20 },
});
