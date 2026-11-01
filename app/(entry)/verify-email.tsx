import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { demoUser } from '@/data/mock/users';
import { colors, layout } from '@/design-system/tokens';
import { useSessionStore } from '@/store/sessionStore';

// SB-007 · Chờ xác minh email. Illustration = Brand/Mầm (Pose=Mail).
export default function VerifyEmail() {
  const insets = useSafeAreaInsets();
  const signIn = useSessionStore((s) => s.signIn);
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const email = params.email ?? demoUser.email;
  const name = params.name ?? demoUser.displayName;

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Xác minh email" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.illustration}>
          <SvgIcon name="mam-mail" size={156} />
        </View>
        <Text variant="displayEditorial" style={styles.full}>
          Mở thư mình vừa gửi nhé.
        </Text>
        <Text variant="bodyLg" color="textSecondary" style={[styles.full, { lineHeight: 22 }]}>
          Nhấn liên kết xác minh trong email rồi quay lại SaveBite để tiếp tục.
        </Text>
        <View style={styles.email}>
          <Text variant="bodyMedium">{email}</Text>
        </View>
        <Step title="1. Mở email SaveBite" hint="Tìm thư xác minh trong hộp thư đến." />
        <Step title="2. Nhấn liên kết trong thư" hint="Quay lại đây khi đã xác minh xong." />
      </ScrollView>

      <View style={[styles.dock, { paddingBottom: 28 + insets.bottom }]}>
        <Button
          label="Tôi đã xác minh"
          onPress={() => {
            // Mock: verification always succeeds. Where the prototype goes next is unconfirmed (see docs/04).
            signIn({ ...demoUser, id: `user-${email}`, email, displayName: name });
            router.replace('/(tabs)');
          }}
        />
        <Button
          label="Đổi địa chỉ email"
          variant="neutral"
          style={{ height: 52 }}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

function Step({ title, hint }: { title: string; hint: string }) {
  return (
    <View style={styles.step}>
      <Text variant="bodyMedium">{title}</Text>
      <Text variant="captionMeta" color="textSecondary">
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 12, paddingBottom: 28 },
  illustration: { height: 156, alignItems: 'center', justifyContent: 'center' },
  full: { width: 353 },
  email: {
    height: 48,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.brand100,
  },
  step: { gap: 3 },
  dock: { gap: 8, paddingTop: 12, paddingHorizontal: layout.screenGutter },
});
