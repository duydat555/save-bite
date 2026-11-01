import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout } from '@/design-system/tokens';

// SB-098 · Quyền riêng tư. Read-only explainer (rows are not tappable in Figma).
const ROWS: { icon: SvgName; title: string; text: string }[] = [
  {
    icon: 'map-pin',
    title: 'Vị trí',
    text: 'Đang chọn khu vực thủ công. Có thể dùng mà không bật GPS.',
  },
  {
    icon: 'fridge',
    title: 'Dữ liệu tủ thực phẩm',
    text: 'Lưu cục bộ trên máy. Không chia sẻ cho cửa hàng.',
  },
  { icon: 'bell', title: 'Thông báo', text: 'Chọn riêng lời nhắc đơn và hạn dùng.' },
];

export default function Privacy() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Quyền riêng tư" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 34 }}>
          {'Bạn quyết định\nnhững gì chia sẻ.'}
        </Text>
        <View style={{ gap: 26, marginVertical: 12 }}>
          {ROWS.map((r) => (
            <View key={r.title} style={styles.row}>
              <View style={{ width: 24, paddingTop: 2 }}>
                <SvgIcon name={r.icon} size={r.icon === 'fridge' ? 24 : 20} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="rowTitle" style={{ lineHeight: 22 }}>
                  {r.title}
                </Text>
                <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
                  {r.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 20 }}>
          Dữ liệu đơn nhận món và dữ liệu tủ thực phẩm được quản lý riêng.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
});
