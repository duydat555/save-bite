import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LargeTitleBar } from '@/components/ui/LargeTitleBar';
import { Text } from '@/components/ui/Text';
import { impactStats } from '@/data/mock/orders';
import { colors, layout, radius } from '@/design-system/tokens';
import { ImpactHeroCard, ProfileHeaderCard, SettingsGroup } from '@/features/account/AccountParts';
import { useSessionStore } from '@/store/sessionStore';

// SB-091 · Profile · Account & Impact Hub. Sub-screens (SB-092/093/097/098/099/100…) are outside Vòng 1 — rows are inert.
// ASSUMPTIONS: guest shows "Khách" (SB-091 only shows the logged-in profile); the "Chỉnh sửa" pill style is estimated.
export default function AccountTab() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((s) => s.user);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <LargeTitleBar
        title="Tài khoản"
        right={
          <Pressable accessibilityRole="button" style={styles.edit}>
            <Text variant="link" color="brand900">
              Chỉnh sửa
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeaderCard
          name={user?.displayName ?? 'Khách'}
          area="ĐH Đà Nẵng · Bán kính đi bộ 1 km"
        />
        <ImpactHeroCard
          label="Những lần bạn ghé nhận"
          stats={[
            { value: `${impactStats.orders} đơn`, caption: 'Phần đã nhận tại quầy' },
            { value: `${impactStats.items} món`, caption: 'Dùng kịp trước ngày hạn' },
          ]}
        />
        <SettingsGroup
          label="Khu vực & nhắc lịch"
          rows={[
            {
              icon: 'map-pin',
              title: 'Khu vực thường dùng',
              subtitle: 'ĐH Đà Nẵng · chọn thủ công',
            },
            { icon: 'bell', title: 'Nhắc lịch & ngày hạn', subtitle: 'Chọn giờ nhận lời nhắc' },
            { icon: 'heart', title: 'Đã lưu', subtitle: 'Ưu đãi bạn muốn xem lại' },
          ]}
        />
        <SettingsGroup
          label="Quyền riêng tư & hỗ trợ"
          rows={[
            {
              icon: 'info',
              title: 'Quyền riêng tư & dữ liệu',
              subtitle: 'Quyền vị trí, xuất và xóa dữ liệu',
            },
            {
              icon: 'warning-circle',
              title: 'Dị ứng & an toàn',
              subtitle: 'Đọc thông tin trước khi chọn món',
            },
            {
              icon: 'info',
              title: 'Trợ giúp nhận món',
              subtitle: 'Câu hỏi thường gặp & báo sự cố',
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 20,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 4,
    paddingBottom: layout.scrollBottomPadding,
  },
  edit: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
});
