import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { orderService } from '@/services/orderService';
import type { ReservationWithOffer } from '@/types';

// SB-064 · Handover Steps · Backup Code ("Đưa mã cho cửa hàng").
const STEPS = [
  { title: 'Mở mã nhận món (QR)', text: 'Chạm “Mở mã QR nhận món” từ đơn đang chờ' },
  { title: 'Đưa màn hình cho nhân viên', text: 'Tăng độ sáng để quét rõ hơn trong tiệm.' },
  { title: 'Đọc mã chữ nếu máy quét lỗi', text: 'Đọc mã này cho nhân viên tại quầy.' },
];

export default function Handover() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [res, setRes] = useState<ReservationWithOffer | null>(null);
  useEffect(() => {
    orderService.getReservation(id).then((r) => setRes(r ?? null));
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Đưa mã cho cửa hàng" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {STEPS.map((s, i) => (
          <View key={s.title} style={styles.step}>
            <View style={styles.num}>
              <Text variant="eyebrow" color="brand900">
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="bold15">{s.title}</Text>
              <Text variant="rowSub" color="textSecondary">
                {s.text}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.codeCard}>
          <Text variant="helper" color="textSecondary">
            Mã dự phòng
          </Text>
          <Text variant="passCode" style={styles.code}>
            {res?.code ?? ' '}
          </Text>
        </View>

        <Text variant="rowSub" color="textSecondary" style={styles.note}>
          Nhân viên cửa hàng là người xác nhận bạn đã nhận món. Bạn không tự bấm “đã nhận”.
        </Text>
        <PressableScale
          accessibilityRole="link"
          onPress={() => router.push({ pathname: '/reserve/order/[id]/incident', params: { id } })}
          style={styles.help}
        >
          <Text variant="semi14" color="price">
            Cần hỗ trợ thêm?
          </Text>
        </PressableScale>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 22, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  num: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.brand100,
  },
  codeCard: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 20,
    marginTop: 4,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  code: { fontSize: 30 },
  note: { textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 },
  help: { alignSelf: 'center', height: 44, justifyContent: 'center' },
});
