import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';
import { NoticeCard } from '@/features/pantry/PantryFlowParts';

// SB-088 · Gợi ý từ tủ của bạn. Rule-based copy exactly as in Figma ("không phải công thức do AI tạo"); overdue items are
// never suggested (see SB-084). Static fixtures for the demo items.
const SUGGESTIONS: { icon: SvgName; title: string; lines: string[] }[] = [
  {
    icon: 'bread',
    title: 'Bánh mì cùng trứng',
    lines: ['Bánh mì nên dùng trước 20/10', 'Trứng nên dùng trước 26/10'],
  },
  {
    icon: 'plant',
    title: 'Sữa cho bữa sáng',
    lines: ['Sữa tươi có Hạn sử dụng 21/10', 'Đọc hướng dẫn sau khi mở nắp'],
  },
];

export default function PantrySuggestions() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Gợi ý từ tủ của bạn" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 34 }}>
          {'Món sẵn trong tủ,\nbữa sáng nhẹ nhàng.'}
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
          Gợi ý theo quy tắc từ các món còn hạn; không phải công thức do AI tạo.
        </Text>
        <View style={{ gap: 22, marginVertical: 8 }}>
          {SUGGESTIONS.map((s) => (
            <View key={s.title} style={styles.row}>
              <SvgIcon name={s.icon} size={32} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="semi16" style={{ fontSize: 15, lineHeight: 22 }}>
                  {s.title}
                </Text>
                {s.lines.map((l) => (
                  <Text key={l} variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                    {l}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
        <NoticeCard
          tone="warning"
          title="Chỉ dùng thực phẩm còn phù hợp"
          body="Món quá Hạn sử dụng không xuất hiện trong gợi ý. Luôn kiểm tra nhãn và điều kiện bảo quản."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
});
