import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { NoticeCard, StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import { dateKindShort, freshnessOf, shortDate } from '@/utils/pantry';

// SB-084 · Đã quá hạn dùng. Shows `?id=` or the first overdue item. Entry point from the Pantry tab is not drawn → dev hub.
export default function PantryOverdue() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const items = usePantryStore((s) => s.items);
  const item = items.find((i) => (id ? i.id === id : freshnessOf(i.expiry) === 'overdue'));

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Đã quá hạn dùng" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {item ? (
          <>
            <NoticeCard
              tone="danger"
              title="Không khuyến nghị sử dụng"
              body={`${item.name} đã qua Hạn sử dụng (Use by).\nKhông đưa món này vào gợi ý bữa ăn.`}
            />
            <View style={styles.item}>
              <SvgIcon name={item.icon as SvgName} size={32} />
              <View style={{ flex: 1 }}>
                <Text variant="semi16" color="danger" style={{ fontSize: 15, lineHeight: 22 }}>
                  {`${item.name} · ${item.quantity}`}
                </Text>
                <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                  {`${dateKindShort(item.dateKind)} ${shortDate(item.expiry)}`}
                </Text>
                <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                  Đã quá ngày hạn trên nhãn.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <Text variant="bodyMedium">Không có món nào quá hạn.</Text>
        )}
        <Text variant="title20" style={{ marginTop: 8 }}>
          Hai loại ngày hạn, hai ý nghĩa
        </Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          Hạn sử dụng: không khuyến nghị dùng sau ngày này.
        </Text>
        <Text variant="bodyLg" style={{ lineHeight: 22, marginTop: 8 }}>
          Nên dùng trước: xem hướng dẫn trên nhãn; ứng dụng không xác nhận thay bạn về an toàn.
        </Text>
      </ScrollView>
      {item ? (
        <StickyDock>
          <Button
            label="Đánh dấu đã bỏ"
            onPress={() =>
              router.push({ pathname: '/account/pantry/discard/[id]', params: { id: item.id } })
            }
          />
        </StickyDock>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
});
