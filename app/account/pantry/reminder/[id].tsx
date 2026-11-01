import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Choice } from '@/components/ui/Choice';
import { Text } from '@/components/ui/Text';
import { Toggle } from '@/components/ui/Toggle';
import { storageLabel } from '@/constants/pantry';
import { colors, radius } from '@/design-system/tokens';
import { GlyphIcon, ItemSummary, StickyDock, flowStyles } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import type { PantryReminder } from '@/types';

// SB-085 · Thiết lập nhắc hạn · Reminder Settings. Initial state (toggle off, "Trước 1 ngày", "07:30") as drawn in Figma.
export default function PantryReminderScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = usePantryStore((s) => s.items.find((i) => i.id === id));
  const update = usePantryStore((s) => s.update);
  const [r, setR] = useState<PantryReminder>(
    item?.reminder ?? { enabled: false, daysBefore: 1, time: '07:30' },
  );
  if (!item) return null;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Nhắc hạn" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <ItemSummary
          glyph={<GlyphIcon name="bell" />}
          name={item.name}
          sub={`${item.quantity} · ${storageLabel[item.storage]}`}
        />
        <Text variant="heroTitle">Một lời nhắc vừa lúc.</Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          Chọn trước ngày hạn bao lâu và giờ bạn tiện xem.
        </Text>

        <View style={styles.toggleCard}>
          <Text variant="semi14">Bật nhắc cho món này</Text>
          <Toggle
            accessibilityLabel="Bật nhắc cho món này"
            value={r.enabled}
            onChange={(enabled) => setR({ ...r, enabled })}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="rowSubMedium" style={styles.label}>
            Nhắc trước ngày hạn
          </Text>
          <View style={styles.row}>
            <Choice
              label="Trước 1 ngày"
              selected={r.daysBefore === 1}
              onPress={() => setR({ ...r, daysBefore: 1 })}
            />
            <Choice
              label="Trước 2 ngày"
              selected={r.daysBefore === 2}
              onPress={() => setR({ ...r, daysBefore: 2 })}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="rowSubMedium" style={styles.label}>
            Giờ nhận lời nhắc
          </Text>
          <View style={styles.row}>
            <Choice
              label="07:30"
              selected={r.time === '07:30'}
              onPress={() => setR({ ...r, time: '07:30' })}
            />
            <Choice
              label="17:30"
              selected={r.time === '17:30'}
              onPress={() => setR({ ...r, time: '17:30' })}
            />
          </View>
        </View>

        <Text variant="rowSub" color="textSecondary" style={flowStyles.note}>
          Giờ Việt Nam (UTC+7). Bạn có thể thay đổi bất cứ lúc nào.
        </Text>
        <Text variant="rowSub" color="textSecondary" style={flowStyles.note}>
          Thông báo trên máy cần quyền cho phép. Bạn vẫn xem lời nhắc trong ứng dụng.
        </Text>
      </ScrollView>
      <StickyDock offset={36}>
        <Button
          label="Lưu nhắc hạn"
          onPress={() => {
            update(item.id, { reminder: r });
            router.back();
          }}
        />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  toggleCard: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  // figma 404:4905: first block at y20, uniform 16 gaps, label 18 high + 8 + choices 52 (172.5 wide, gap 8)
  content: { gap: 16, paddingHorizontal: 20, paddingTop: 20 },
  label: { lineHeight: 18 },
  row: { flexDirection: 'row', gap: 8 },
});
