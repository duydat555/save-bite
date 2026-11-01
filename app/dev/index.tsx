import { Link, router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { storage } from '@/data/storage';
import { colors, layout, radius, spacing } from '@/design-system/tokens';
import { orderService } from '@/services/orderService';
import { useDevFlags } from '@/store/devFlags';
import { usePantryStore } from '@/store/pantryStore';
import { useSessionStore } from '@/store/sessionStore';

// Dev hub (long-press the splash title, ~1.2 s). Not part of the Figma design.
const LINKS: { label: string; href: Href }[] = [
  { label: 'Màu · Font · Component →', href: '/dev/foundations' },
  { label: 'Onboarding (SB-002…004) →', href: '/(entry)/onboarding' },
  { label: 'Welcome (SB-005) →', href: '/(entry)/welcome' },
  { label: 'Đăng nhập (SB-008) →', href: '/(entry)/login' },
  { label: 'Đăng ký (SB-006) →', href: '/(entry)/register' },
  { label: 'Tab chính →', href: '/(tabs)' },
  { label: 'Đánh giá cửa hàng (SB-042) →', href: '/offer/merchant/merchant-tiem-banh-a/reviews' },
  {
    label: 'Chi tiết đánh giá (SB-043) →',
    href: '/offer/merchant/merchant-tiem-banh-a/review-report',
  },
];

export default function DevHub() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + spacing[24], paddingBottom: insets.bottom + spacing[24] },
      ]}
    >
      <Text variant="brandTitle" color="brand900">
        SaveBite · Dev hub
      </Text>
      <Text variant="meta" color="textSecondary">
        Lối tắt để thử từng màn và đặt lại dữ liệu demo
      </Text>

      <View style={styles.links}>
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} style={styles.link}>
            <Text variant="itemTitleRow" color="textInverse">
              {l.label}
            </Text>
          </Link>
        ))}
      </View>

      <View style={styles.links}>
        <Action
          label="Đăng xuất & xem lại onboarding"
          onPress={async () => {
            useSessionStore.setState({ user: null, isGuest: false, hasSeenOnboarding: false });
            router.replace('/');
          }}
        />
        <Action
          label="Đặt lại Tủ thực phẩm (7 món)"
          onPress={() => usePantryStore.getState().reset()}
        />
        <Action
          label="Làm trống Tủ thực phẩm"
          onPress={() => usePantryStore.setState({ items: [] })}
        />
        <Action
          label="Giả lập lỗi mạng ở lần giữ chỗ tới (SB-057)"
          onPress={() => useDevFlags.getState().arm('offline')}
        />
        <Action
          label="Giả lập hết hàng ở lần giữ chỗ tới (SB-058)"
          onPress={() => useDevFlags.getState().arm('stock')}
        />
        <Action
          label="Ẩn lịch sử đơn (xem SB-073 Đơn trống)"
          onPress={() => useDevFlags.getState().setHistoryCleared(true)}
        />
        <Action
          label="Hiện lại lịch sử đơn"
          onPress={() => useDevFlags.getState().setHistoryCleared(false)}
        />
        {(
          [
            ['Sẵn sàng (SB-066)', 'ready'],
            ['Sắp hết giờ (SB-067)', 'closing_soon'],
            ['Hết hạn (SB-068)', 'expired'],
            ['Hoàn tất (SB-072)', 'completed'],
            ['Chờ nhận (mặc định)', 'awaiting_pickup'],
          ] as const
        ).map(([label, status]) => (
          <Action
            key={status}
            label={`Đơn mới nhất → ${label}`}
            onPress={async () => {
              const [latest] = await orderService.listReservations();
              if (latest) await orderService.setStatus(latest.id, status);
            }}
          />
        ))}
        <Action
          label="Xoá các đơn đã giữ chỗ"
          onPress={async () => {
            await storage.remove('savebite.reservations');
          }}
        />
      </View>
    </ScrollView>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.link, styles.action]}>
      <Text variant="itemTitleRow" color="brand900">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: layout.screenGutter, gap: spacing[8] },
  links: { marginTop: spacing[16], gap: spacing[12] },
  link: {
    padding: spacing[16],
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.brand900,
  },
  action: { backgroundColor: colors.brand100 },
});
