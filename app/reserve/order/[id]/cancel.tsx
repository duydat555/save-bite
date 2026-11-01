import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassButton } from '@/components/ui/GlassButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { SheetModal } from '@/components/ui/SheetModal';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { orderService } from '@/services/orderService';

const REASONS = ['Bạn đột xuất', 'Không kịp giờ'];

// SB-070 · Xác nhận hủy đơn · Policy & Reason (sheet over SB-062). Sheet top at y=422 → 430 high.
export default function CancelSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reason, setReason] = useState(0);
  const [busy, setBusy] = useState(false);

  return (
    <SheetModal height={430}>
      {({ dismiss, bottomInset }) => (
        <View style={styles.body}>
          <View style={styles.head}>
            <Text variant="title20">Xác nhận hủy đặt trước</Text>
            <GlassButton symbol="xmark" accessibilityLabel="Đóng" size={44} onPress={dismiss} />
          </View>
          <View style={styles.note}>
            <Text variant="rowSub" color="warning" style={{ lineHeight: 20 }}>
              Bạn có thể hủy miễn phí trước 17:00. Nếu cần hỗ trợ, hãy báo sự cố trong đơn.
            </Text>
          </View>
          <Text variant="rowSub" color="textSecondary" style={{ marginTop: 18 }}>
            Lý do hủy (tùy chọn)
          </Text>
          <View style={styles.chips}>
            {REASONS.map((r, i) => (
              <PressableScale
                key={r}
                accessibilityRole="button"
                accessibilityState={{ selected: reason === i }}
                onPress={() => setReason(i)}
                style={[styles.chip, reason === i ? styles.chipOn : styles.chipOff]}
              >
                <Text variant="semi14" color={reason === i ? 'white' : 'textPrimary'}>
                  {r}
                </Text>
              </PressableScale>
            ))}
          </View>
          <View style={[styles.cta, { bottom: bottomInset + 14 }]}>
            <PressableScale
              accessibilityRole="button"
              disabled={busy}
              onPress={async () => {
                setBusy(true);
                await orderService.setStatus(id, 'cancelled');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                router.dismissTo({ pathname: '/reserve/order/[id]/cancelled', params: { id } });
              }}
              style={styles.danger}
            >
              <Text variant="buttonLabel" color="white">
                {busy ? 'Đang hủy…' : 'Xác nhận hủy đặt trước'}
              </Text>
            </PressableScale>
            <Button
              label="Giữ lại đơn"
              variant="neutral"
              style={{ height: 52 }}
              onPress={dismiss}
            />
          </View>
        </View>
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  head: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  note: {
    marginTop: 16,
    padding: 14,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  chips: { flexDirection: 'row', gap: 10, marginTop: 10 },
  chip: {
    height: 44,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  chipOn: { backgroundColor: colors.brand900 },
  chipOff: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  cta: { position: 'absolute', left: 20, right: 20, gap: 8 },
  danger: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
  },
});
