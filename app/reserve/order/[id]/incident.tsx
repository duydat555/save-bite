import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';

// SB-069 · Incident Report · Pickup Issue. Single choice + optional note; sending is a mock (shows a confirmation).
const OPTIONS = [
  'Cửa hàng đóng cửa sớm',
  'Mã không quét được',
  'Món khác xa mô tả',
  'Nghi ngờ chất lượng / dị ứng',
];

export default function Incident() {
  const insets = useSafeAreaInsets();
  const [choice, setChoice] = useState(2);
  const [note, setNote] = useState('');

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Báo sự cố" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 + 52 + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="bold15" style={{ fontSize: 17, lineHeight: 22 }}>
          Bạn gặp vấn đề gì khi nhận món?
        </Text>
        {OPTIONS.map((o, i) => {
          const on = i === choice;
          return (
            <PressableScale
              key={o}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => setChoice(i)}
              style={[styles.option, on ? styles.on : styles.off]}
            >
              <Text variant="semi14" color={on ? 'white' : 'textPrimary'} style={{ flex: 1 }}>
                {o}
              </Text>
              {on ? <SymbolView name="checkmark" size={16} tintColor={colors.white} /> : null}
            </PressableScale>
          );
        })}
        <Text variant="rowSub" color="textSecondary" style={{ marginTop: 10 }}>
          Mô tả thêm (không bắt buộc)
        </Text>
        <TextInput
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Món nhận được khác với mô tả, thiếu rau theo ảnh…"
          placeholderTextColor={colors.textSecondary}
          style={styles.textarea}
        />
      </ScrollView>
      <View style={[styles.footer, { bottom: insets.bottom + 20 }]}>
        <Button
          label="Gửi báo cáo"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Đã gửi báo cáo', 'Cảm ơn bạn. SaveBite sẽ xem xét và phản hồi sớm.', [
              { text: 'Đóng', onPress: () => router.back() },
            ]);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  option: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.tile,
  },
  on: { backgroundColor: colors.brand900 },
  off: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.canvas },
  textarea: {
    height: 120,
    padding: 14,
    textAlignVertical: 'top',
    borderRadius: radius.tile,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.canvas,
    color: colors.textPrimary,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
  },
  footer: { position: 'absolute', left: layout.screenGutter, right: layout.screenGutter },
});
