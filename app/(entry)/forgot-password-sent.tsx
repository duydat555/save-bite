import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { demoUser } from '@/data/mock/users';
import { colors, layout } from '@/design-system/tokens';

// SB-010 · Đã gửi liên kết khôi phục. "Quay lại đăng nhập" → back to SB-008, "Thử địa chỉ email khác" → SB-009.
export default function ForgotPasswordSent() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Kiểm tra email" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mam}>
          <SvgIcon name="mam-mail" size={156} />
        </View>
        <Text variant="displayEditorial">{'Đặt lại mật khẩu\ntừ liên kết trong thư.'}</Text>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Nếu email khớp tài khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu. Nhớ xem cả mục Spam.
        </Text>
        <View style={styles.email}>
          <Text variant="bodyMedium">{email ?? demoUser.email}</Text>
        </View>
        <View style={{ gap: 3 }}>
          <Text variant="semi14" style={{ lineHeight: 22 }}>
            Chưa thấy email?
          </Text>
          <Text variant="captionMeta" color="textSecondary" style={{ lineHeight: 18 }}>
            Kiểm tra thư rác và địa chỉ bạn đã nhập.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.dock, { paddingBottom: insets.bottom + 28 }]}>
        <Button label="Quay lại đăng nhập" onPress={() => router.dismissTo('/(entry)/login')} />
        <Button
          label="Thử địa chỉ email khác"
          variant="neutral"
          style={{ height: 52 }}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12, paddingBottom: 24 },
  mam: { height: 156, alignItems: 'center', justifyContent: 'center' },
  email: {
    height: 48,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.brand100,
  },
  dock: { gap: 8, paddingTop: 12, paddingHorizontal: layout.screenGutter },
});
