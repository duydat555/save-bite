import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { OptionRow } from '@/components/ui/OptionRow';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { useFilters, type Budget } from '@/store/filterStore';

// SB-024 · Lọc ngân sách (sheet, top ≈ y412 → 440 high). "Tùy chỉnh" has no editor in Figma → treated as ≤ 40.000đ.
const OPTIONS: { label: string; value: Budget }[] = [
  { label: 'Tối đa 30.000đ', value: 30000 },
  { label: 'Tối đa 50.000đ', value: 50000 },
  { label: 'Tùy chỉnh', value: 'custom' },
  { label: 'Không giới hạn', value: null },
];

export default function BudgetSheet() {
  const budget = useFilters((s) => s.budget);
  const set = useFilters((s) => s.set);
  const [value, setValue] = useState<Budget>(budget);
  return (
    <SheetModal height={440}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ flex: 1 }}>
              Ngân sách mỗi phần
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={{ gap: 8 }}>
            {OPTIONS.map((o) => (
              <OptionRow
                key={o.label}
                title={o.label}
                selected={value === o.value}
                onPress={() => setValue(o.value)}
              />
            ))}
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <Button
              label="Lưu ngân sách"
              onPress={() => {
                set({ budget: value });
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
