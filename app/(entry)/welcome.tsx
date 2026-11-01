import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Wordmark } from '@/components/ui/Wordmark';
import { colors, layout } from '@/design-system/tokens';
import { useSessionStore } from '@/store/sessionStore';

// SB-005 · Welcome Gate · Guest or Login. Photo 393×404, scrim from y=210, card (r28 top) from y=394.
const PHOTO_HEIGHT = 404;
const CARD_TOP = 394;

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const continueAsGuest = useSessionStore((s) => s.continueAsGuest);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('@assets/images/offers/bread-sourdough.jpg')}
        contentFit="cover"
        style={styles.photo}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
        style={styles.scrim}
        pointerEvents="none"
      />
      <View style={[styles.wordmark, { top: insets.top + 19 }]}>
        <Wordmark size="lg" />
      </View>
      <View style={styles.headline}>
        <Text variant="welcomeTitle" color="white">
          Phần ngon cuối ngày,
        </Text>
        <Text variant="welcomeTitle" color="white">
          chờ bạn ghé lấy.
        </Text>
        <Text variant="welcomeSub" color="heroSub" style={styles.sub}>
          Gần bạn. Nhận tại tiệm. Trả tại quầy.
        </Text>
      </View>

      <View style={[styles.card, { paddingBottom: insets.bottom + 20 }]}>
        <Button
          label="Khám phá món gần bạn"
          onPress={() => {
            continueAsGuest();
            router.replace('/(tabs)');
          }}
        />
        <Text variant="helper" color="textSecondary" style={styles.center}>
          Xem tự do. Đăng nhập khi đặt giữ chỗ.
        </Text>
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text variant="meta" color="textSecondary">
            hoặc
          </Text>
          <View style={styles.line} />
        </View>
        <View style={styles.neutrals}>
          <Button
            label="Đăng nhập"
            variant="neutral"
            onPress={() => router.push('/(entry)/login')}
          />
          <Button
            label="Tạo tài khoản"
            variant="neutral"
            onPress={() => router.push('/(entry)/register')}
          />
        </View>
        <Text variant="helperRelaxed" color="textSecondary" style={styles.footnote}>
          Bạn có thể xem món và dùng tủ thực phẩm mà không cần tài khoản.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  photo: { position: 'absolute', left: 0, top: 0, right: 0, height: PHOTO_HEIGHT },
  scrim: { position: 'absolute', left: 0, right: 0, top: 210, height: PHOTO_HEIGHT - 210 },
  wordmark: { position: 'absolute', left: layout.screenGutter },
  headline: {
    position: 'absolute',
    left: layout.screenGutter,
    right: layout.screenGutter,
    top: 276,
  },
  sub: { marginTop: 10 }, // figma: subtitle at y=358, title block ends at 348
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CARD_TOP,
    bottom: 0,
    paddingTop: 32,
    paddingHorizontal: layout.screenGutter,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.canvas,
  },
  center: { textAlign: 'center', marginTop: 8 }, // y=92 under a button ending at 84
  divider: {
    marginTop: 37, // divider centre y=152 → label top 144; helper text ends ≈107
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.borderDefault },
  neutrals: { marginTop: 29, gap: 8 }, // buttons at y=188 and 246
  footnote: { marginTop: 44, textAlign: 'center' }, // y=340
});
