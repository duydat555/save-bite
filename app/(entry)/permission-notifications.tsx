import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import { useAccountStore } from '@/store/accountStore';

// SB-012 · Quyền thông báo · Nhắc khung giờ. Reached after SB-011. "Bật nhắc nhở" turns the in-app reminder toggles on
// (SB-097); "Để sau" leaves them as they are. MOCK: no OS permission prompt (Expo Go can't deliver pushes reliably).
const PREVIEWS = [
  {
    when: '16:45',
    text: 'Sắp đến giờ nhận bánh. Hẹn bạn tại tiệm lúc 17:00–18:00.',
  },
  {
    when: 'Ngày mai · 08:00',
    text: 'Nhớ dùng sữa trước ngày 21/10. Xem ngày trên nhãn trong tủ nhé.',
  },
];

export default function PermissionNotifications() {
  const insets = useSafeAreaInsets();
  const setPref = useAccountStore((s) => s.setPref);
  const done = () => router.dismissTo('/(tabs)');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 61 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.preview}>
          <Text variant="semi16" style={{ fontSize: 15, lineHeight: 22 }}>
            Xem trước lời nhắc
          </Text>
          {PREVIEWS.map((p) => (
            <View key={p.when} style={styles.note}>
              <View style={styles.noteHead}>
                <SvgIcon name="bag-mark-forest" size={24} />
                <Text variant="semi14" style={{ flex: 1 }}>
                  SaveBite
                </Text>
                <Text variant="meta" color="textSecondary">
                  {p.when}
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ fontSize: 14, lineHeight: 18 }}>
                {p.text}
              </Text>
            </View>
          ))}
        </View>
        <Text variant="largeTitle" style={{ fontSize: 24, lineHeight: 30, marginTop: 18 }}>
          Đừng bỏ lỡ giờ nhận món
        </Text>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Chọn lời nhắc hữu ích trước giờ nhận và ngày hạn. Bạn có thể đổi lựa chọn trong Tùy chọn
          nhắc nhở.
        </Text>
      </ScrollView>
      <View style={[styles.dock, { paddingBottom: insets.bottom + 44 }]}>
        <Button
          label="Bật nhắc nhở"
          onPress={() => {
            setPref('beforeSlot', true);
            setPref('expirySoon', true);
            done();
          }}
        />
        <Button label="Để sau" variant="neutral" onPress={done} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  // figma 243:4460: card y120 (353×320, p20), notes 104 high at +58 / +178 (p14, header 24, text at +46)
  content: { gap: 8, paddingHorizontal: layout.screenGutter },
  preview: {
    height: 320,
    gap: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.brand100,
  },
  note: { height: 104, padding: 14, gap: 8, borderRadius: 20, backgroundColor: colors.white },
  noteHead: { height: 24, flexDirection: 'row', alignItems: 'center', gap: 8 },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 8,
    paddingHorizontal: layout.screenGutter,
  },
});
