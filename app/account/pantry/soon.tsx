import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { storageLabel } from '@/constants/pantry';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { NoticeCard, StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import { dateKindShort, daysUntil, freshnessOf, shortDate } from '@/utils/pantry';

// SB-083 · Cần dùng sớm: items whose freshness is "Sắp hạn". Entry point from the Pantry tab is not drawn → dev hub only.
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
        <View style={{ marginTop: 8 }}>
          {items.map((it) => (
            <PressableScale
              key={it.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/account/pantry/[id]', params: { id: it.id } })
              }
              style={styles.row}
            >
              <SvgIcon name={it.icon as SvgName} size={32} />
              <View style={{ flex: 1 }}>
                <Text variant="semi16" style={{ fontSize: 15, lineHeight: 22 }}>
                  {it.name}
                </Text>
                <Text variant="meta" color="textSecondary" style={styles.sub}>
                  {`${it.quantity} · ${storageLabel[it.storage]}`}
                </Text>
                <Text variant="meta" color="textSecondary" style={styles.sub}>
                  {`${dateKindShort(it.dateKind)} ${shortDate(it.expiry)} · Còn ${daysUntil(it.expiry)} ngày`}
                </Text>
              </View>
              <SvgIcon name="caret-right-24" size={24} />
            </PressableScale>
          ))}
        </View>
        <Text variant="meta" color="textSecondary">
          Theo ngày hạn bạn đã nhập.
        </Text>
      </ScrollView>
      <StickyDock>
        <Button label="Gợi ý dùng món" onPress={() => router.push('/account/pantry/suggestions')} />
      </StickyDock>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  sub: { lineHeight: 18 },
});
