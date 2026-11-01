import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';

import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

type Props = {
  image: ImageSource | number;
  title: string;
  merchantLine: string; // "Bếp Xanh Campus · Cách 350m"
  priceLabel: string;
  availabilityLabel: string; // "17:30–19:00 · Còn 4 phần"
  onPress?: () => void;
};

/** Figma OfferListRow: full width × 92, thumb 72 (r12), r18, 1px border. */
export function OfferListRow({
  image,
  title,
  merchantLine,
  priceLabel,
  availabilityLabel,
  onPress,
}: Props) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.row}>
      <Image source={image} contentFit="cover" style={styles.thumb} />
      <View style={styles.text}>
        <Text variant="itemTitleRow" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="meta" color="textSecondary" numberOfLines={1}>
          {merchantLine}
        </Text>
        <View style={styles.priceLine}>
          <Text variant="priceRow" color="price">
            {priceLabel}
          </Text>
          <Text variant="meta" color="success" numberOfLines={1}>
            {availabilityLabel}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 10,
    borderRadius: radius.listRow,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
  thumb: { width: 72, height: 72, borderRadius: radius.thumb },
  text: { flex: 1, gap: 3, overflow: 'hidden' },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
