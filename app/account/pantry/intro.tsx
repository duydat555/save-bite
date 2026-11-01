import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';

// SB-074 · Giới thiệu Pantry · Onboarding (no AppBar in Figma). Entry point is NOT specified in Figma → reachable from the
// dev hub only; the CTA continues to the Pantry tab. Photo card geometry is from node 190:4362 (353×260, r28).
const STEPS = [
  { n: '01', title: 'Thêm món đang có', text: 'Tên món, vị trí cất và ngày trên nhãn.' },
  { n: '02', title: 'Xem món cần dùng sớm', text: 'Phân biệt hạn sử dụng và nên dùng trước.' },
  { n: '03', title: 'Đánh dấu khi đã dùng', text: 'Lịch sử dùng món được lưu trên máy.' },
];

export default function PantryIntro() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 150 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photos}>
          <Image
            source={require('@assets/images/account/brand-pattern.svg')}
            contentFit="cover"
            style={styles.pattern}
          />
          <View style={[styles.photoWrap, styles.milk]}>
            <Image
              source={require('@assets/images/account/pantry-milk.png')}
              contentFit="cover"
              style={styles.photo}
            />
          </View>
          <View style={[styles.photoWrap, styles.eggs]}>
            <Image
              source={require('@assets/images/account/pantry-eggs.png')}
              contentFit="cover"
              style={styles.photo}
            />
          </View>
          <View style={styles.label}>
            <Text variant="eyebrow" style={{ lineHeight: 16, letterSpacing: 0.12 }}>
              DÙNG KỊP, ĐỠ PHÍ
            </Text>
            <Text variant="captionMeta" color="textSecondary">
              Một góc bếp gọn hơn
            </Text>
          </View>
        </View>

        <Text variant="displayEditorial">{'Món trong tủ,\nnhớ dùng đúng lúc.'}</Text>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Lưu món bạn có ở nhà. Tủ thực phẩm giúp bạn nhìn rõ món cần dùng trước và hạn đã nhập.
        </Text>
        <View style={{ gap: 14 }}>
          {STEPS.map((s) => (
            <View key={s.n} style={styles.step}>
              <View style={styles.num}>
                <Text variant="eyebrow" style={{ lineHeight: 16, letterSpacing: 0.12 }}>
                  {s.n}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text variant="bodyMedium">{s.title}</Text>
                <Text variant="captionMeta" color="textSecondary">
                  {s.text}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.dock, { paddingBottom: insets.bottom + 20 - 14 }]}>
        <Button label="Bắt đầu với tủ của tôi" onPress={() => router.replace('/(tabs)/pantry')} />
        <Text variant="captionMeta" color="textSecondary">
          Lưu trên thiết bị · Không tự thêm từ đơn hàng
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 18, paddingHorizontal: layout.screenGutter },
  photos: {
    height: 260,
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: colors.brand100,
  },
  pattern: { position: 'absolute', left: -18.5, top: 0, width: 390, height: 260, opacity: 0.35 },
  photoWrap: { position: 'absolute', overflow: 'hidden', borderRadius: 20 },
  photo: { width: '100%', height: '100%' },
  // figma: 210×240 rotated 9° around its centre, bounding box left -49.54 / top 36 (245×270)
  milk: { left: -32, top: 51, width: 210, height: 240, transform: [{ rotate: '9deg' }] },
  // figma: 175×205 rotated -8°, bounding box left 188 / top -8.36 (202×227)
  eggs: { left: 201, top: 2.6, width: 175, height: 205, transform: [{ rotate: '-8deg' }] },
  label: {
    position: 'absolute',
    left: 155,
    top: 183,
    width: 177,
    gap: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.canvas,
  },
  step: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  num: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.brand100,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: layout.screenGutter,
    backgroundColor: colors.canvas,
  },
});
