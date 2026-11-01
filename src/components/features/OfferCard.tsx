import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

type Props = {
  image: ImageSource | number;
  stockLabel: string; // "Còn 3 phần"
  merchantLine: string; // "Tiệm Bánh A · 450m"
  title: string;
  pickupLabel: string; // "Nhận 17:00–18:00"
  priceLabel: string; // "25.000đ"
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Figma OfferCard: 169 wide, photo 118, 1px border, r20, min-height 246. */
export function OfferCard({
  image,
  stockLabel,
  merchantLine,
  title,
  pickupLabel,
  priceLabel,
  onPress,
  style,
}: Props) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={[styles.card, style]}>
      <View style={styles.photo}>
        <Image source={image} contentFit="cover" style={StyleSheet.absoluteFill} />
        <View style={styles.tag}>
          <Tag label={stockLabel} />
        </View>
      </View>
      <View style={styles.body}>
        <Text variant="caption" color="textSecondary">
          {merchantLine}
        </Text>
        <Text variant="itemTitleCard">{title}</Text>
        <Text variant="meta" color="brand700">
          {pickupLabel}
        </Text>
        <Text variant="price" color="price">
          {priceLabel}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 169,
    minHeight: 246,
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
  photo: { height: 118, width: '100%', overflow: 'hidden' },
  tag: { position: 'absolute', left: 10, top: 10 },
  body: { gap: 4, paddingTop: 10, paddingBottom: 12, paddingHorizontal: 12 },
});
