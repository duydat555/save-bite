import { StyleSheet, View } from 'react-native';

import { GlassButton } from '@/components/ui/GlassButton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, spacing } from '@/design-system/tokens';

type Props = {
  title: string; // "Chào Minh Anh"
  areaLabel: string; // "Đà Nẵng · Khu học xá ▾"
  onPressSaved?: () => void;
  onPressNotifications?: () => void;
};

/** Figma BrandHeader: 393×56, px20 py8; BagMark 24 + title, area line, two 50pt glass buttons. */
export function BrandHeader({ title, areaLabel, onPressSaved, onPressNotifications }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.wordmark}>
          <SvgIcon name="bag-mark-forest" size={24} />
          <Text variant="brandTitle" color="brand900">
            {title}
          </Text>
        </View>
        <Text variant="meta" color="textSecondary">
          {areaLabel}
        </Text>
      </View>
      <View style={styles.actions}>
        <GlassButton symbol="heart" accessibilityLabel="Đã lưu" onPress={onPressSaved} />
        <GlassButton symbol="bell" accessibilityLabel="Thông báo" onPress={onPressNotifications} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
    paddingVertical: spacing[8],
    backgroundColor: colors.canvas,
  },
  brand: { gap: spacing[2] },
  wordmark: { height: 28, flexDirection: 'row', alignItems: 'center', gap: spacing[6] },
  actions: { flexDirection: 'row', gap: spacing[8] },
});
