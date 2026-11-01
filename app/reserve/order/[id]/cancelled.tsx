import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { duration } from '@/design-system/motion';
import { colors, layout } from '@/design-system/tokens';
import { orderService } from '@/services/orderService';

// SB-071 · Hủy đơn thành công · Empty State.
export default function Cancelled() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticket, setTicket] = useState('SB-001');
  useEffect(() => {
    orderService.getReservation(id).then((r) => r && setTicket(r.ticketNo));
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Hủy đặt trước" onBack={() => router.replace('/(tabs)/orders')} />
      <Animated.View entering={FadeInDown.duration(duration.slow)} style={styles.center}>
        <View style={styles.badge}>
          <SymbolView name="checkmark" size={26} weight="light" tintColor={colors.brand900} />
        </View>
        <Text variant="largeTitle" style={styles.title}>
          Đã hủy đơn thành công
        </Text>
        <Text variant="body" color="textSecondary" style={styles.body}>
          {`Đơn ${ticket} đã được hủy. Phần bánh được mở lại cho bạn khác. Bạn không bị trừ chi phí nào.`}
        </Text>
      </Animated.View>
      <View style={styles.actions}>
        <Button label="Xem đơn của tôi" onPress={() => router.replace('/(tabs)/orders')} />
        <Button
          label="Khám phá món khác"
          variant="neutral"
          style={{ height: 50 }}
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  center: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: layout.screenGutter + 12,
    marginTop: 120,
  },
  badge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: colors.brand100,
  },
  title: { fontSize: 22, lineHeight: 28, marginTop: 8 },
  body: { textAlign: 'center', lineHeight: 20 },
  actions: { gap: 12, paddingHorizontal: layout.screenGutter, marginTop: 44 },
});
