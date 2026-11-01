import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { IconListRow, NoticeCard, StickyDock } from '@/features/pantry/PantryFlowParts';
import { usePantryStore } from '@/store/pantryStore';
import { dateKindShort, freshnessOf, shortDate } from '@/utils/pantry';

// SB-084 · Đã quá hạn dùng (node 133:3314): banner y12 (106), row 72 high at +20, heading at +20, two paragraphs separated
// by a blank line (110 high), dock button at y728. Shows `?id=` or the first overdue item.
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
            <IconListRow
              icon={item.icon as SvgName}
              title={`${item.name} · ${item.quantity}`}
              titleColor="danger"
              lines={[
                `${dateKindShort(item.dateKind)} ${shortDate(item.expiry)}`,
                'Đã quá ngày hạn trên nhãn.',
              ]}
              height={72}
            />
          </>
        ) : (
          <Text variant="bodyMedium">Không có món nào quá hạn.</Text>
        )}
        <Text variant="titleSemi20">Hai loại ngày hạn, hai ý nghĩa</Text>
        <Text variant="bodyLg" style={{ lineHeight: 22 }}>
          {
            'Hạn sử dụng: không khuyến nghị dùng sau ngày này.\n\nNên dùng trước: xem hướng dẫn trên nhãn; ứng dụng không xác nhận thay bạn về an toàn.'
          }
        </Text>
      </ScrollView>
      {item ? (
        <StickyDock offset={38}>
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
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
});
