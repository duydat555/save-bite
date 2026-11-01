import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { storageLabel } from '@/constants/pantry';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { IconListRow, NoticeCard, StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import { dateKindShort, daysUntil, freshnessOf, shortDate } from '@/utils/pantry';

// SB-083 · Cần dùng sớm (node 133:3283): banner y12 (106 high), rows 80 high every 100, note at +20, dock button at y728.
// Lists items whose freshness is "Sắp hạn". Entry: the "Sắp hạn" tag on a Pantry row (ASSUMPTION — no link in Figma).
export default function PantrySoon() {
  const insets = useSafeAreaInsets();
  const items = usePantryStore((s) => s.items).filter((i) => freshnessOf(i.expiry) === 'soon');

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Cần dùng sớm" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <NoticeCard
          tone="warning"
          title="Ưu tiên trong 24–48 giờ"
          body={`${items.length} món đang gần ngày hạn bạn đã nhập. Kiểm tra nhãn và cách bảo quản.`}
        />
        {items.map((it) => (
          <IconListRow
            key={it.id}
            icon={it.icon as SvgName}
            title={it.name}
            lines={[
              `${it.quantity} · ${storageLabel[it.storage]}`,
              `${dateKindShort(it.dateKind)} ${shortDate(it.expiry)} · Còn ${daysUntil(it.expiry)} ngày`,
            ]}
            height={80}
            caret
            onPress={() => router.push({ pathname: '/account/pantry/[id]', params: { id: it.id } })}
          />
        ))}
        <Text variant="captionMeta" color="textSecondary" style={{ lineHeight: 18 }}>
          Theo ngày hạn bạn đã nhập.
        </Text>
      </ScrollView>
      <StickyDock offset={38}>
        <Button label="Gợi ý dùng món" onPress={() => router.push('/account/pantry/suggestions')} />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
});
