import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { colors, layout } from '@/design-system/tokens';
import { Avatar } from '@/features/account/AccountParts';
import { useAccountStore } from '@/store/accountStore';
import { useSessionStore } from '@/store/sessionStore';

// SB-092 · Chỉnh sửa hồ sơ · Monogram. Avatar 72, three fields, "Lưu thay đổi" directly under the fields (not sticky).
export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((s) => s.user);
  const updateUser = useSessionStore((s) => s.updateUser);
  const campus = useAccountStore((s) => s.campus);
  const setCampus = useAccountStore((s) => s.setCampus);

  const [name, setName] = useState(user?.displayName ?? 'Minh Anh');
  const [email, setEmail] = useState(user?.email ?? 'minhanh@example.com');
  const [area, setArea] = useState(campus);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Chỉnh sửa hồ sơ" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatar}>
          <Avatar size={72} />
        </View>
        <InputField label="Tên hiển thị" value={name} onChangeText={setName} />
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField label="Khu học xá mặc định" value={area} onChangeText={setArea} />
        <View style={styles.cta}>
          <Button
            label="Lưu thay đổi"
            onPress={() => {
              updateUser({ displayName: name.trim() || 'Minh Anh', email: email.trim() });
              setCampus(area.trim() || 'ĐH Đà Nẵng');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 94:1641 (absolute y): avatar 72 at y124, inputs 74 high at y236 / 316 / 396 (6 apart), button 52 at y488 (18 below)
  content: { gap: 6, paddingHorizontal: layout.screenGutter, paddingTop: 9 },
  avatar: { alignItems: 'center', marginBottom: 34 }, // 124+72 → 236 = 40 (6 from the gap)
  cta: { marginTop: 12 },
});
