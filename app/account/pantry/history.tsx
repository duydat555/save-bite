import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import type { SvgName } from '@/design-system/icons/svg-data';
import { colors, layout, radius } from '@/design-system/tokens';
import { usePantryStore } from '@/store/pantryStore';

// SB-089 · Lịch sử tủ thực phẩm. "Đã thêm" is tinted success; other statuses are secondary text.
export default function PantryHistory() {
  const insets = useSafeAreaInsets();
  const history = usePantryStore((s) => s.history);
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Lịch sử tủ thực phẩm" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="titleSemi20Tall">Hoạt động trong tủ của bạn</Text>
        {history.length === 0 ? (
          <Text variant="captionMeta" color="textSecondary">
            Chưa có hoạt động nào.
          </Text>
        ) : null}
        {history.map((h) => (
          <View key={h.id} style={styles.card}>
            <View style={styles.tile}>
              <SvgIcon name={h.icon as SvgName} size={22} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="bold14" style={{ lineHeight: 20 }}>
                {h.name}
              </Text>
              <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                <Text variant="meta" color={h.status === 'Đã thêm' ? 'success' : 'textSecondary'}>
                  {h.status}
                </Text>
                {` · ${h.detail}`}
              </Text>
              <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                {h.when}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 133:3460: title at y12 (28 high), cards 88 high every 96 starting at y48
  content: { gap: 8, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 88,
    gap: 12,
    paddingHorizontal: 13,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  tile: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.thumb,
    backgroundColor: colors.brand100,
  },
});
