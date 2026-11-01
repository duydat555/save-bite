import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { storageLabel } from '@/constants/pantry';
import { colors, radius } from '@/design-system/tokens';
import { ItemSummary, StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';

// SB-087 · Đánh dấu đã bỏ. Reason is optional ("Chưa chọn lý do"). Icons are SF Symbols (estimated from the screenshot:
// clock / refrigerator / basket / exclamationmark.circle), as the Figma glyphs are not exported as assets.
const REASONS: { label: string; symbol: SFSymbol }[] = [
  { label: 'Quá hạn sử dụng', symbol: 'clock' },
  { label: 'Quên trong tủ', symbol: 'refrigerator' },
  { label: 'Mua hoặc nấu quá nhiều', symbol: 'basket' },
  { label: 'Hỏng sớm hơn dự kiến', symbol: 'exclamationmark.circle' },
];

export default function PantryDiscard() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = usePantryStore((s) => s.items.find((i) => i.id === id));
  const remove = usePantryStore((s) => s.remove);
  const log = usePantryStore((s) => s.log);
  const [reason, setReason] = useState<number | null>(null);
  if (!item) return null;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Đánh dấu đã bỏ" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <ItemSummary
          glyph={<SymbolView name="trash" size={24} tintColor={colors.brand900} />}
          name={item.name}
          sub={`${item.quantity} · ${storageLabel[item.storage]}`}
        />
        <Text variant="largeTitle" style={{ fontSize: 22, lineHeight: 30 }}>
          Ghi lại món đã bỏ
        </Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          Bạn có thể chọn lý do để xem lại sau. Món đã bỏ không tính vào số món dùng kịp hạn.
        </Text>
        {REASONS.map((r, i) => {
          const on = reason === i;
          return (
            <PressableScale
              key={r.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setReason(on ? null : i)}
              style={[styles.reason, on && styles.reasonOn]}
            >
              <SymbolView
                name={r.symbol}
                size={22}
                tintColor={on ? colors.canvas : colors.brand900}
              />
              <Text
                variant="semi14"
                color={on ? 'canvas' : 'textPrimary'}
                style={{ flex: 1, fontSize: 15 }}
              >
                {r.label}
              </Text>
              {on ? (
                <SymbolView
                  name="checkmark"
                  size={16}
                  weight="semibold"
                  tintColor={colors.canvas}
                />
              ) : null}
            </PressableScale>
          );
        })}
        <Text variant="rowSubMedium" color="textSecondary">
          {reason === null ? 'Chưa chọn lý do' : REASONS[reason].label}
        </Text>
      </ScrollView>
      <StickyDock offset={36}>
        <Button
          label="Xác nhận đã bỏ"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            log(item, 'Đã bỏ', item.quantity);
            remove(item.id);
            router.dismissTo('/(tabs)/pantry');
          }}
        />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  reason: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
  },
  reasonOn: { borderColor: colors.brand900, backgroundColor: colors.brand900 }, // figma "Selected reason · forest"
  // figma 133:3401: item context y12, heading y68 (30), body y110, reasons 56 high every 68 from y166, hint y438
  content: { gap: 12, paddingHorizontal: 20, paddingTop: 12 },
});
