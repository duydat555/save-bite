import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/ui/SvgIcon';
import type { SvgName } from '@/design-system/icons/svg-data';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { PressableScale } from '@/components/ui/PressableScale';

type Props = {
  icon: SvgName; // 18pt glyph inside a 40pt brand100 tile
  title: string;
  subtitle?: string;
  subtitleTone?: 'secondary' | 'success';
  chevron?: boolean;
  height?: number;
  onPress?: () => void;
};

/** Figma MerchantRow (353×65) / PickupInfo (353×64): icon tile + two lines, 1px bottom border, py12. */
export function InfoRow({
  icon,
  title,
  subtitle,
  subtitleTone = 'secondary',
  chevron,
  height,
  onPress,
}: Props) {
  return (
    <PressableScale
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={[styles.row, height != null && { height }]}
    >
      <View style={styles.left}>
        <View style={styles.tile}>
          <SvgIcon name={icon} size={18} />
        </View>
        <View style={styles.text}>
          <Text variant="rowTitle">{title}</Text>
          {subtitle ? (
            <Text
              variant={subtitleTone === 'success' ? 'rowSubMedium' : 'rowSub'}
              color={subtitleTone === 'success' ? 'success' : 'textSecondary'}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {chevron ? <SvgIcon name="caret-right-16" size={16} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  tile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.thumb,
    backgroundColor: colors.brand100,
  },
  text: { flex: 1, gap: 2 },
});
