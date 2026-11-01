import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { Text } from '@/components/ui/Text';
import { storageLabel } from '@/constants/pantry';
import { colors, radius } from '@/design-system/tokens';
import { ItemSummary, StickyDock, flowStyles } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import { formatAmount, parseQuantity } from '@/utils/pantry';

// SB-086 · Cập nhật lượng dùng. "1/4" · "1/2" · "Hết" = share used; default "1/2" as in Figma.
// Reached from the list "Dùng" button and from SB-081 "Đánh dấu đã dùng".
const OPTIONS = [
  { label: '1/4', used: 0.25 },
  { label: '1/2', used: 0.5 },
  { label: 'Hết', used: 1 },
];

export default function PantryUsage() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = usePantryStore((s) => s.items.find((i) => i.id === id));
  const update = usePantryStore((s) => s.update);
  const remove = usePantryStore((s) => s.remove);
  const log = usePantryStore((s) => s.log);
  const [used, setUsed] = useState(0.5);
  if (!item) return null;

  const { amount, unit } = parseQuantity(item.quantity);
  const left = Math.max(amount * (1 - used), 0);
  const leftText = left <= 0 ? '0' : `${formatAmount(left)} ${unit}`.trim();

  const confirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (used >= 1) {
      log(item, 'Đã dùng', item.quantity);
      remove(item.id);
      router.dismissTo('/(tabs)/pantry');
      return;
    }
    log(item, 'Đã dùng', `${formatAmount(amount * used)} ${unit}`.trim());
    update(item.id, { quantity: leftText });
    router.dismissTo('/(tabs)/pantry');
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Cập nhật lượng dùng" />
      <ScrollView
        contentContainerStyle={[flowStyles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <ItemSummary
          glyph={<SymbolView name="fork.knife" size={22} tintColor={colors.brand900} />}
          name={item.name}
          sub={`${item.quantity} · ${storageLabel[item.storage]}`}
        />
        <Text variant="largeTitle" style={[flowStyles.title, { marginTop: 8 }]}>
          Bạn đã dùng bao nhiêu?
        </Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          Chọn lượng đã dùng. Phần còn lại tiếp tục được theo dõi trong tủ.
        </Text>
        <View style={styles.row}>
          {OPTIONS.map((o) => (
            <Choice
              key={o.label}
              label={o.label}
              height={52}
              selected={used === o.used}
              onPress={() => setUsed(o.used)}
            />
          ))}
        </View>
        <View style={styles.remaining}>
          <Text variant="meta" color="textSecondary">
            Lượng còn lại
          </Text>
          <Text variant="bold15" color="brand900" style={{ fontSize: 20, lineHeight: 26 }}>
            {leftText === '0' ? 'Đã hết' : leftText}
          </Text>
        </View>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          {'Nếu dùng hết, lịch nhắc của món sẽ kết thúc.\nDùng một phần sẽ giữ lại nhắc hạn.'}
        </Text>
      </ScrollView>
      <StickyDock>
        <Button label="Xác nhận lượng đã dùng" onPress={confirm} />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  row: { flexDirection: 'row', gap: 12, marginTop: 6 },
  remaining: {
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: colors.brand100,
  },
});
