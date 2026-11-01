import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';

import { GlassButton } from '@/components/ui/GlassButton';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, spacing } from '@/design-system/tokens';

type Props = {
  title: string; // "Chào Minh Anh"
  areaLabel: string; // "Đà Nẵng · Khu học xá ▾"
  onPressSaved?: () => void;
  onPressNotifications?: () => void;
  onPressArea?: () => void;
  /** SB-013 guest: wordmark + "Đăng nhập" pill instead of the heart / bell buttons. */
  guest?: boolean;
  onPressLogin?: () => void;
};

/** Figma BrandHeader: 393×56, px20 py8; BagMark 24 + title, area line, two 50pt glass buttons. */
export function BrandHeader({
  title,
  areaLabel,
  onPressSaved,
  onPressNotifications,
  onPressArea,
  guest,
  onPressLogin,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.wordmark}>
          <SvgIcon name="bag-mark-forest" size={24} />
          <Text variant="brandTitle" color="brand900">
            {title}
          </Text>
        </View>
        <PressableScale accessibilityRole="button" onPress={onPressArea}>
          <Text variant="meta" color="textSecondary">
            {areaLabel}
          </Text>
        </PressableScale>
      </View>
      {guest ? (
        <PressableScale accessibilityRole="button" onPress={onPressLogin} style={styles.login}>
          <Text variant="semi14" color="brand900">
            Đăng nhập
          </Text>
        </PressableScale>
      ) : (
        <View style={styles.actions}>
          <GlassButton symbol="heart" accessibilityLabel="Đã lưu" onPress={onPressSaved} />
          <GlassButton
            symbol="bell"
            accessibilityLabel="Thông báo"
            onPress={onPressNotifications}
          />
        </View>
      )}
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
  // figma (screenshot SB-013): 103×46 pill, brand100 fill
  login: {
    width: 103,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.brand100,
  },
});
