import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { formatPrice } from '@/utils/format';

/* ActiveOrderHeroCard (353×214): warning strip + photo + 3 lines + primary CTA (50 high). */
export function ActiveOrderHeroCard({
  image,
  statusLine,
  title,
  meta,
  payLine,
  onPress,
  onOpenCode,
}: {
  image: ImageSource | number;
  statusLine: string; // "Chờ nhận · 17:00–18:00"
  title: string;
  meta: string; // "Tiệm Bánh A · 1 phần"
  payLine: string; // "Trả 25.000đ tại quầy"
  onPress: () => void;
  onOpenCode: () => void;
}) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.hero}>
      <View style={styles.strip}>
        <Text variant="link" color="warning">
          {statusLine}
        </Text>
      </View>
      <View style={styles.heroBody}>
        <Image source={image} contentFit="cover" style={styles.heroPhoto} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="semi16" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="rowSubMedium" color="textSecondary">
            {meta}
          </Text>
          <Text variant="bold15" color="price">
            {payLine}
          </Text>
        </View>
      </View>
      <View style={styles.heroCta}>
        <Button label="Mở mã QR nhận món" onPress={onOpenCode} style={{ height: 50 }} />
      </View>
    </PressableScale>
  );
}

/* CompletedOrderRow (353×64): 48pt photo, two lines, right-aligned price, 1px bottom rule. */
export function CompletedOrderRow({
  image,
  title,
  metaLine,
  priceVnd,
}: {
  image: ImageSource | number;
  title: string;
  metaLine: string;
  priceVnd: number;
}) {
  return (
    <View style={styles.row}>
      <Image source={image} contentFit="cover" style={styles.rowPhoto} />
      <View style={{ flex: 1, gap: 3, marginTop: 10 }}>
        <Text variant="itemTitleRow" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="rowSub" color="textSecondary" numberOfLines={1}>
          {metaLine}
        </Text>
      </View>
      <Text variant="semi14" style={{ marginTop: 10 }}>
        {formatPrice(priceVnd)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  strip: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.warningBg,
  },
  heroBody: {
    flexDirection: 'row',
    gap: 52, // figma: copy starts at x132 inside the card (photo 64 at x16)
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroPhoto: { width: 64, height: 64, borderRadius: 8 },
  heroCta: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 16 },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  rowPhoto: { width: 48, height: 48, marginTop: 8, borderRadius: 8 },
});
