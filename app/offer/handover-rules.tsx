import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';

// SB-040 · Quy định nhận món tại quầy · Handover Rules (full screen with AppBar, not a sheet). Static copy.
const STEPS = [
  {
    title: 'Đến đúng khung đã chọn',
    text: 'Nhận 17:00–18:00 theo giờ cửa hàng; trả tại quầy khi đến nhận.',
  },
  { title: 'Mở mã nhận món', text: 'Mở mã trong Đơn của tôi để nhân viên đối chiếu khi nhận.' },
  {
    title: 'Kiểm tra rồi thanh toán tại quầy',
    text: 'Đối chiếu món, thành phần và ngày hạn với nhân viên trước khi thanh toán.',
  },
];

export default function HandoverRules() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Quy định nhận món" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text variant="authTitle" style={{ flex: 1, lineHeight: 30 }}>
            {'Chuẩn bị trước\nkhi đến nhận'}
          </Text>
          <SvgIcon name="mam-carry" size={100} />
        </View>
        <Text variant="bold14">Tiệm Bánh A</Text>
        {STEPS.map((s, i) => (
          <View key={s.title} style={styles.step}>
            <View style={styles.num}>
              <Text variant="eyebrow" color="brand900">
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text variant="bold15">{s.title}</Text>
              <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 20 }}>
                {s.text}
              </Text>
            </View>
          </View>
        ))}
        <Text variant="meta" color="success">
          Bạn có thể mang theo túi hoặc hộp cá nhân.
        </Text>
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button label="Quay lại cửa hàng" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 22, paddingHorizontal: layout.screenGutter, paddingTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  num: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.brand100,
  },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
