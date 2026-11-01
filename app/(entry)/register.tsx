import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { InputField } from '@/components/ui/InputField';
import { Text } from '@/components/ui/Text';
import { DEMO_PASSWORD, demoUser } from '@/data/mock/users';
import { colors, layout } from '@/design-system/tokens';
import { ERROR_GENERIC, MIN_PASSWORD_LENGTH, isValidEmail } from '@/features/auth/validation';
import { authService } from '@/services/authService';

// SB-006 · Đăng ký · Email & Password. Prefilled like the Figma frame; "Tạo tài khoản" is disabled until consent.
export default function Register() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(demoUser.displayName);
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = ERROR_GENERIC;
    if (!isValidEmail(email)) next.email = ERROR_GENERIC;
    if (password.length < MIN_PASSWORD_LENGTH) next.password = ERROR_GENERIC;
    setErrors(next);
    if (next.name || next.email || next.password) return;

    setBusy(true);
    const user = await authService.register(name.trim(), email.trim());
    setBusy(false);
    router.push({
      pathname: '/(entry)/verify-email',
      params: { name: user.displayName, email: user.email },
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Tạo tài khoản" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text variant="authTitle" style={styles.title}>
          Bắt đầu cùng SaveBite
        </Text>
        <Text variant="authSub" color="textSecondary" style={styles.sub}>
          Lưu đơn nhận món và những ưu đãi bạn yêu thích.
        </Text>

        <View style={styles.fields}>
          <InputField
            label="Họ và tên"
            value={name}
            onChangeText={setName}
            error={errors.name}
            textContentType="name"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <InputField
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
          />
        </View>

        <View style={styles.consent}>
          <Checkbox
            checked={consent}
            onChange={setConsent}
            label="Tôi đã đọc cách sử dụng và chính sách quyền riêng tư."
          />
        </View>
        <View style={styles.policyRow}>
          {/* Policy screens are outside Vòng 1 — links are inert for now */}
          <Pressable accessibilityRole="link" style={styles.policyLink}>
            <Text variant="linkMedium13" color="brand700" style={styles.underline}>
              Điều cần biết
            </Text>
          </Pressable>
          <Pressable accessibilityRole="link" style={styles.policyLink}>
            <Text variant="linkMedium13" color="brand700" style={styles.underline}>
              Quyền riêng tư
            </Text>
          </Pressable>
        </View>
        <Text variant="linkMedium13" color="textSecondary" style={styles.helper}>
          Xác nhận đã đọc để tạo tài khoản.
        </Text>

        <Button
          label={busy ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
          onPress={submit}
          disabled={!consent || busy}
          style={styles.cta}
        />

        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace('/(entry)/login')}
          style={styles.existing}
        >
          <Text variant="linkMedium14" color="brand900">
            Đã có tài khoản? Đăng nhập ngay
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: layout.screenGutter, paddingTop: 10 },
  title: { width: 353 },
  sub: { marginTop: 4 },
  fields: { marginTop: 28, gap: 11 },
  consent: { marginTop: 18 },
  policyRow: { flexDirection: 'row', gap: 13, marginTop: -1 },
  policyLink: { width: 170, height: 44, alignItems: 'center', justifyContent: 'center' },
  underline: { textDecorationLine: 'underline' },
  helper: { marginTop: 8, lineHeight: 18 },
  cta: { marginTop: 14 },
  existing: { marginTop: 10, height: 48, alignItems: 'center', justifyContent: 'center' },
});
