import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';
import { IconListRow } from '@/features/pantry/PantryFlowParts';

// SB-088 · Gợi ý từ tủ của bạn (node 133:3407): title 28/32 at y12 (2 lines), sub at y96, rows 72 high at y152 / y244,
// note card (pad 16, 128 high) at y336. Rule-based copy exactly as in Figma ("không phải công thức do AI tạo");
// overdue items are never suggested (see SB-084). Static fixtures for the demo items.
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
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 32 }}>
          {'Món sẵn trong tủ,\nbữa sáng nhẹ nhàng.'}
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
          Gợi ý theo quy tắc từ các món còn hạn; không phải công thức do AI tạo.
        </Text>
        {SUGGESTIONS.map((s) => (
          <IconListRow key={s.title} icon={s.icon} title={s.title} lines={s.lines} height={72} />
        ))}
        <View style={styles.notice}>
          <Text variant="semi16" color="warning" style={{ lineHeight: 22 }}>
            Chỉ dùng thực phẩm còn phù hợp
          </Text>
          <Text variant="bodyLg" style={{ lineHeight: 22 }}>
            Món quá Hạn sử dụng không xuất hiện trong gợi ý. Luôn kiểm tra nhãn và điều kiện bảo
            quản.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  notice: { gap: 8, padding: 16, borderRadius: radius.md, backgroundColor: colors.warningBg },
});
