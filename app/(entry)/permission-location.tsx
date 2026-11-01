import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';

// SB-011 · Quyền vị trí · Bán kính quanh trường. Entered from SB-018 "Dùng vị trí hiện tại"; both buttons continue to
// SB-012. MOCK: no real OS permission prompt is raised (the demo never reads GPS — the area is always chosen by hand).
export default function PermissionLocation() {
  const insets = useSafeAreaInsets();
  const next = () => router.push('/(entry)/permission-notifications');
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 59 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.map}>
          <Image
            source={require('@assets/images/account/map-canvas.png')}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.pin}>
            <SvgIcon name="bag-mark-cream" size={36} />
          </View>
          <View style={styles.pill}>
            <Text variant="bold15">Bạn chủ động chọn khu vực</Text>
          </View>
        </View>
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 34, marginTop: 4 }}>
          Món ngon quanh bạn
        </Text>
        <Text variant="bodyLg" color="textSecondary" style={{ lineHeight: 22 }}>
          Dùng vị trí để gợi ý món quanh bạn, hoặc tự chọn khu vực. Vị trí không được công khai cho
          cửa hàng.
        </Text>
      </ScrollView>
      <View style={[styles.dock, { paddingBottom: insets.bottom + 20 }]}>
        <Button label="Cho phép vị trí" onPress={next} />
        <Button label="Tự chọn khu vực" variant="neutral" style={{ height: 52 }} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { gap: 12, paddingHorizontal: layout.screenGutter },
  // figma (screenshot): map card 353×322 r28 starting y=118; centre pin 64 brand900 disc; label pill at the bottom
  map: { height: 322, overflow: 'hidden', borderRadius: 28 },
  pin: {
    position: 'absolute',
    left: 144.5,
    top: 117,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: colors.brand900,
  },
  pill: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 28,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.canvas,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 8,
    paddingHorizontal: layout.screenGutter,
  },
});
