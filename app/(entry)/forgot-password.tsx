import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Text } from '@/components/ui/Text';
import { demoUser } from '@/data/mock/users';
import { colors, layout } from '@/design-system/tokens';
import { ERROR_GENERIC, isValidEmail } from '@/features/auth/validation';

// SB-009 · Quên mật khẩu · Email & Keyboard. "Quên mật khẩu?" on SB-008 → here → "Gửi liên kết khôi phục" → SB-010.
// The email is prefilled like the Figma frame and the keyboard is open (autoFocus); the CTA sits right above it.
export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(demoUser.email);
  const [error, setError] = useState<string>();

  const send = () => {
    if (!isValidEmail(email)) return setError(ERROR_GENERIC);
    router.push({ pathname: '/(entry)/forgot-password-sent', params: { email: email.trim() } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={{ height: insets.top }} />
      <AppBar title="Quên mật khẩu" />
      <View style={styles.content}>
        <Text variant="authTitle" style={{ fontSize: 26, lineHeight: 32 }}>
          Đặt lại mật khẩu
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ marginTop: 4, lineHeight: 18 }}>
          Nhập email bạn đã dùng để tạo tài khoản. SaveBite sẽ gửi hướng dẫn đặt lại mật khẩu.
        </Text>
        <View style={{ marginTop: 24 }}>
          <InputField
            label="Email"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError(undefined);
            }}
            error={error}
            autoFocus
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="send"
            onSubmitEditing={send}
          />
        </View>
      </View>
      <View style={styles.spacer} />
      <View style={[styles.dock, { paddingBottom: 16 }]}>
        <Button label="Gửi liên kết khôi phục" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  spacer: { flex: 1 },
  dock: { paddingHorizontal: layout.screenGutter, paddingTop: 12 },
});
