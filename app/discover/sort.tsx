import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { OptionRow } from '@/components/ui/OptionRow';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { useFilters, type Sort } from '@/store/filterStore';

// SB-027 · Sắp xếp kết quả (sheet over the results list, top ≈ y412 → 440 high).
const OPTIONS: { label: string; value: Sort }[] = [
  { label: 'Khoảng cách gần nhất', value: 'distance' },
  { label: 'Giờ nhận sớm nhất', value: 'earliest' },
  { label: 'Giá thấp đến cao', value: 'price' },
  { label: 'Ít phần còn lại nhất', value: 'stock' },
];

export default function SortSheet() {
  const sort = useFilters((s) => s.sort);
  const set = useFilters((s) => s.set);
  const [value, setValue] = useState<Sort>(sort);
  return (
    <SheetModal height={440}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ flex: 1 }}>
              Sắp xếp danh sách
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={{ gap: 8 }}>
            {OPTIONS.map((o) => (
              <OptionRow
                key={o.value}
                title={o.label}
                selected={value === o.value}
                onPress={() => setValue(o.value)}
              />
            ))}
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <Button
              label="Áp dụng"
              onPress={() => {
                set({ sort: value });
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
