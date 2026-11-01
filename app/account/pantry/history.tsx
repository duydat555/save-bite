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
        <Text variant="title20" style={{ marginBottom: 4 }}>
          Hoạt động trong tủ của bạn
        </Text>
        {history.length === 0 ? (
          <Text variant="captionMeta" color="textSecondary">
            Chưa có hoạt động nào.
          </Text>
        ) : null}
        {history.map((h) => (
          <View key={h.id} style={styles.card}>
            <View style={styles.tile}>
              <SvgIcon name={h.icon as SvgName} size={24} />
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
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  tile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: colors.brand100,
  },
});
