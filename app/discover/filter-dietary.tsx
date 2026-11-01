import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { OptionRow } from '@/components/ui/OptionRow';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { DIETARY_OPTIONS, useFilters } from '@/store/filterStore';

// SB-026 · Nhu cầu ăn uống & An toàn (sheet, top ≈ y328 → 524 high). Multi-select; choosing any makes SB-049 (allergen
// conflict) appear when opening a dish, because no merchant declares allergens (see openOffer).
export default function DietarySheet() {
  const dietary = useFilters((s) => s.dietary);
  const set = useFilters((s) => s.set);
  const [value, setValue] = useState<string[]>(dietary);
  const toggle = (o: string) =>
    setValue((v) => (v.includes(o) ? v.filter((x) => x !== o) : [...v, o]));

  return (
    <SheetModal height={524}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20" style={{ flex: 1 }}>
              Nhu cầu ăn uống
            </Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={{ gap: 8 }}>
            {DIETARY_OPTIONS.map((o) => (
              <OptionRow key={o} title={o} selected={value.includes(o)} onPress={() => toggle(o)} />
            ))}
          </View>
          <View style={styles.notice}>
            <Text variant="noticeTitle" color="warning" style={{ fontSize: 13 }}>
              Dị ứng cần được xác minh
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
              Bộ lọc không xác nhận món phù hợp với dị ứng. Hãy kiểm tra thành phần với cửa hàng
              trước khi đặt; không chọn nếu chưa xác nhận được.
            </Text>
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 12 }]}>
            <Button
              label="Lưu nhu cầu"
              onPress={() => {
                set({ dietary: value });
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
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 33 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  notice: {
    gap: 6,
    marginTop: 14,
    padding: 14,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warningBg,
  },
  cta: { position: 'absolute', left: 20, right: 20 },
});
