import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Alert, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { categoryMeta, dateKindLabel, storageLabel } from '@/constants/pantry';
import { colors, layout, radius } from '@/design-system/tokens';
import { usePantryStore } from '@/store/pantryStore';
import { formatDate } from '@/utils/pantry';

// SB-090 · Dữ liệu trên máy. Export opens the system share sheet (JSON / CSV text); delete clears the pantry after a
// confirmation (the confirmation dialog itself is not drawn in Figma — native Alert, ESTIMATE).
export default function PantryData() {
  const insets = useSafeAreaInsets();
  const items = usePantryStore((s) => s.items);
  const clearAll = usePantryStore((s) => s.clearAll);

  const exportJson = () =>
    Share.share({ title: 'savebite-tu-thuc-pham.json', message: JSON.stringify(items, null, 2) });
  const exportCsv = () => {
    const head = ['Tên', 'Nhóm', 'Số lượng', 'Nơi cất', 'Loại ngày', 'Ngày hạn'];
    const rows = items.map((i) =>
      [
        i.name,
        categoryMeta[i.category].label,
        i.quantity,
        storageLabel[i.storage],
        dateKindLabel[i.dateKind],
        formatDate(i.expiry),
      ]
        .map((c) => `"${c.replace(/"/g, '""')}"`)
        .join(','),
    );
    return Share.share({
      title: 'savebite-tu-thuc-pham.csv',
      message: [head.join(','), ...rows].join('\n'),
    });
  };
  const wipe = () =>
    Alert.alert(
      'Xóa dữ liệu trên máy',
      'Toàn bộ tủ thực phẩm và lịch sử sẽ bị xóa khỏi thiết bị này.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearAll();
          },
        },
      ],
    );

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Dữ liệu trên máy" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <SvgIcon name="fridge" size={24} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="semi16" style={{ fontSize: 15, lineHeight: 22 }}>
              Chỉ lưu trên thiết bị
            </Text>
            <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
              Bạn có thể dùng tủ mà không cần đăng nhập.
            </Text>
          </View>
        </View>
        <Text variant="title20" style={{ marginTop: 8 }}>
          Xuất dữ liệu của bạn
        </Text>
        <ExportCard
          title="Xuất tệp JSON"
          sub="Đầy đủ tên, lượng, ngày hạn và nơi cất"
          onPress={exportJson}
        />
        <ExportCard title="Xuất tệp CSV" sub="Dạng bảng, dễ đọc và sắp xếp" onPress={exportCsv} />
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
          Dữ liệu tủ được lưu riêng trên thiết bị này.
        </Text>
        <PressableScale accessibilityRole="button" onPress={wipe} style={styles.danger}>
          <View style={styles.dangerHead}>
            <SymbolView name="trash" size={18} tintColor={colors.danger} />
            <Text variant="bold15" color="danger" style={{ fontSize: 16 }}>
              Xóa dữ liệu trên máy
            </Text>
          </View>
          <Text variant="bodyLg" style={{ lineHeight: 22 }}>
            Cần xác nhận trước khi xóa toàn bộ tủ. Thao tác này không hủy đơn nhận món.
          </Text>
        </PressableScale>
      </ScrollView>
    </View>
  );
}

function ExportCard({ title, sub, onPress }: { title: string; sub: string; onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.tile}>
        <SymbolView name="arrow.down.to.line" size={20} tintColor={colors.brand900} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bold14" style={{ lineHeight: 20 }}>
          {title}
        </Text>
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
          {sub}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 14, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  card: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
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
  danger: { gap: 8, padding: 16, borderRadius: radius.md, backgroundColor: colors.dangerBg },
  dangerHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
