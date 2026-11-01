import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Text } from '@/components/ui/Text';
import { Toggle } from '@/components/ui/Toggle';
import { colors, layout } from '@/design-system/tokens';
import { useAccountStore, type NotificationPrefs } from '@/store/accountStore';

// SB-097 · Tùy chọn thông báo. Initial toggles as in Figma (last one off); the quiet-hours row is display-only.
const SECTIONS: {
  title: string;
  rows: { key: keyof NotificationPrefs; label: string; sub: string }[];
}[] = [
  {
    title: 'Đơn nhận món',
    rows: [
      { key: 'beforeSlot', label: 'Trước khung giờ nhận', sub: 'Nhắc trước 30 phút' },
      { key: 'closingSoon', label: 'Gần hết giờ nhận', sub: 'Giúp bạn kịp đến cửa hàng' },
    ],
  },
  {
    title: 'Tủ thực phẩm',
    rows: [
      { key: 'expirySoon', label: 'Sắp tới hạn sử dụng', sub: 'Theo ngày bạn nhập' },
      { key: 'morning', label: 'Nhắc vào buổi sáng', sub: '07:30 · giờ Việt Nam' },
      {
        key: 'suggestions',
        label: 'Gợi ý dùng món trong tủ',
        sub: 'Từ những món đang có trong tủ',
      },
    ],
  },
];

export default function NotificationSettings() {
  const insets = useSafeAreaInsets();
  const prefs = useAccountStore((s) => s.prefs);
  const setPref = useAccountStore((s) => s.setPref);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Tùy chọn thông báo" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((s) => (
          <View key={s.title} style={{ gap: 20 }}>
            <Text variant="titleSemi20">{s.title}</Text>
            {s.rows.map((r) => (
              <View key={r.key} style={styles.row}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="rowTitle" style={{ lineHeight: 22 }}>
                    {r.label}
                  </Text>
                  <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
                    {r.sub}
                  </Text>
                </View>
                <Toggle
                  accessibilityLabel={r.label}
                  value={prefs[r.key]}
                  onChange={(v) => setPref(r.key, v)}
                />
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 72, justifyContent: 'center', gap: 4 }}>
          <Text variant="rowTitle" style={{ lineHeight: 22 }}>
            Giờ yên lặng
          </Text>
          <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
            22:00–07:00 · Giờ Việt Nam
          </Text>
        </View>
        <Text variant="meta" color="textSecondary" style={{ lineHeight: 18 }}>
          Nếu tắt quyền thông báo hệ thống, bạn vẫn xem lời nhắc trong ứng dụng.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 133:3606: section title y12 (26), rows 48 high every 68, "Giờ yên lặng" row 72 high, note 36 — uniform 20 gaps
  content: { gap: 20, paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  row: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
});
