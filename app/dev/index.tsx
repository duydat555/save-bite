import { Link, Redirect, router, type Href } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { storage } from '@/data/storage';
import { colors, layout, radius, spacing } from '@/design-system/tokens';
import { DEV_ENTRY_ENABLED } from '@/constants/app';
import { resetDemoData } from '@/utils/resetDemo';
import { orderService } from '@/services/orderService';
import { useDevFlags } from '@/store/devFlags';
import { useAccountStore } from '@/store/accountStore';
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
  // Pantry / Account screens whose entry point is not drawn in Figma (see docs/04-NAVIGATION-FLOW.md).
  { label: 'Giới thiệu Tủ thực phẩm (SB-074) →', href: '/account/pantry/intro' },
  { label: 'Cần dùng sớm (SB-083) →', href: '/account/pantry/soon' },
  { label: 'Đã quá hạn dùng (SB-084) →', href: '/account/pantry/overdue' },
  { label: 'Gợi ý từ tủ (SB-088) →', href: '/account/pantry/suggestions' },
  { label: 'Thông báo (SB-095/096) →', href: '/account/notifications' },
  { label: 'Nhận sớm (SB-031) →', href: '/discover/urgent' },
  // Màn có bản đồ thật (docs/12-MAP-AUDIT.md)
  { label: 'Bản đồ (SB-016/017) →', href: '/discover/map' },
  { label: 'Quanh trường (SB-032, bản đồ card) →', href: '/discover/nearby' },
  { label: 'Vị trí cửa hàng (SB-039) →', href: '/offer/merchant/merchant-tiem-banh-a/directions' },
  { label: 'Lưu khu vực (SB-094, vòng bán kính) →', href: '/account/areas/add' },
  { label: 'Quyền vị trí (SB-011) →', href: '/(entry)/permission-location' },
  { label: 'Quyền thông báo (SB-012) →', href: '/(entry)/permission-notifications' },
];

export default function DevHub() {
  const insets = useSafeAreaInsets();
  if (!DEV_ENTRY_ENABLED) return <Redirect href="/" />;
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

      <Pressable
        accessibilityRole="button"
        onPress={() =>
          Alert.alert(
            'Đặt lại toàn bộ dữ liệu demo?',
            'Xóa đăng nhập, tủ thực phẩm, đơn đã giữ chỗ, mục đã lưu, tìm kiếm và cài đặt, rồi quay về màn splash.',
            [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Đặt lại', style: 'destructive', onPress: () => resetDemoData() },
            ],
          )
        }
        style={styles.reset}
      >
        <Text variant="bold15" color="white" style={{ textAlign: 'center' }}>
          Đặt lại TOÀN BỘ dữ liệu demo
        </Text>
      </Pressable>

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
          label="Nạp 7 món mẫu vào Tủ (xem SB-075)"
          onPress={() => {
            usePantryStore.getState().reset();
            useAccountStore.getState().setPantryIntroSeen(true);
          }}
        />
        <Action
          label="Làm trống Tủ thực phẩm (SB-076)"
          onPress={() => {
            usePantryStore.getState().clearAll();
            useAccountStore.getState().setPantryIntroSeen(false); // next tab open shows SB-074 → SB-076
          }}
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
          label="Mở SB-064 (Đưa mã cho cửa hàng) cho đơn mới nhất"
          onPress={async () => {
            const [latest] = await orderService.listReservations();
            if (latest)
              router.push({ pathname: '/reserve/order/[id]/handover', params: { id: latest.id } });
          }}
        />
        {(
          [
            ['Bình thường (SB-034)', 'normal'],
            ['Hết phần (SB-046)', 'soldout'],
            ['Ngoài giờ nhận (SB-047)', 'closed'],
            ['Gần đóng cửa (SB-048)', 'closing'],
          ] as const
        ).map(([label, st]) => (
          <Action
            key={st}
            label={`Trạng thái chi tiết món → ${label}`}
            onPress={() => useDevFlags.getState().setOfferState(st)}
          />
        ))}
        <Action
          label="Xóa thông báo (xem SB-096 trống)"
          onPress={() => useDevFlags.getState().setNotificationsCleared(true)}
        />
        <Action
          label="Hiện lại thông báo"
          onPress={() => useDevFlags.getState().setNotificationsCleared(false)}
        />
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
  reset: { height: 56, justifyContent: 'center', borderRadius: 14, backgroundColor: colors.danger },
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
