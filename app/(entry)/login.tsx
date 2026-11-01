import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { DEMO_PASSWORD, demoUser } from '@/data/mock/users';
import { ERROR_GENERIC, ERROR_WRONG_PASSWORD, isValidEmail } from '@/features/auth/validation';
import { authService } from '@/services/authService';
import { useSessionStore } from '@/store/sessionStore';

// SB-008 · Đăng nhập · Email & Password. Prefilled like the Figma frame (demo account).
export default function Login() {
  const insets = useSafeAreaInsets();
  const signIn = useSessionStore((s) => s.signIn);
  const continueAsGuest = useSessionStore((s) => s.continueAsGuest);
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = ERROR_GENERIC;
    if (!password) next.password = ERROR_WRONG_PASSWORD;
    setErrors(next);
    if (next.email || next.password) return;

    setBusy(true);
    const user = await authService.signIn(email.trim(), password);
    setBusy(false);
    if (!user) return setErrors({ password: ERROR_WRONG_PASSWORD });
    signIn(user);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Đăng nhập" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 + 128 + 16 }]}
      >
        <Text variant="authTitle" style={styles.title}>
          Chào bạn quay lại
        </Text>
        <Text variant="authSub" color="textSecondary" style={styles.sub}>
          Đăng nhập để giữ chỗ và theo dõi đơn của bạn.
        </Text>

        <View style={styles.fields}>
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
            textContentType="password"
            onSubmitEditing={submit}
          />
        </View>

        <Pressable accessibilityRole="link" style={styles.forgot}>
          <Text variant="linkMedium13" color="brand900">
            Quên mật khẩu?
          </Text>
        </Pressable>

        <Button
          label={busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
          onPress={submit}
          disabled={busy}
          style={styles.cta}
        />

        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace('/(entry)/register')}
          style={styles.signup}
        >
          <Text variant="linkMedium14" color="textSecondary">
            {'Chưa có tài khoản?  Đăng ký'}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.guestCard, { bottom: insets.bottom + 40 }]}>
        <Text variant="bodyMedium">Bạn muốn xem món trước?</Text>
        <Button
          label="Khám phá không đăng nhập"
          variant="neutral"
          style={{ height: 52 }}
          onPress={() => {
            continueAsGuest();
            router.replace('/(tabs)');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: layout.screenGutter, paddingTop: 16 },
  title: { width: 353 },
  sub: { marginTop: 4 },
  fields: { marginTop: 29, gap: 11 },
  forgot: {
    alignSelf: 'flex-end',
    width: 124,
    height: 48,
    marginTop: 19,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cta: { marginTop: -1 }, // figma: hit area ends at 441, button starts at 440
  signup: { marginTop: 3, height: 48, alignItems: 'center', justifyContent: 'center' },
  guestCard: {
    position: 'absolute',
    left: layout.screenGutter,
    right: layout.screenGutter,
    gap: 12,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
});
