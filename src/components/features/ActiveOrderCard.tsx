import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';

type Props = {
  status: string; // "Chờ nhận"
  time: string; // "17:00–18:00"
  title: string;
  subtitle: string; // "Tiệm Bánh A · Trả tại quầy"
  onPress?: () => void;
};

/** SB-014 active order strip (353×94): receipt tile, status pill + time, title, merchant line, chevron. Sizes from screenshot. */
export function ActiveOrderCard({ status, time, title, subtitle, onPress }: Props) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.tile}>
        <SvgIcon name="chat-circle-text" size={24} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.top}>
          <View style={styles.pill}>
            <Text variant="eyebrowPill" color="warning" style={{ fontSize: 12 }}>
              {status}
            </Text>
          </View>
          <Text variant="bold14">{time}</Text>
        </View>
        <Text variant="bold15" style={{ fontSize: 16 }} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="meta" color="textSecondary" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <SvgIcon name="caret-right-24" size={24} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  tile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.input,
    backgroundColor: colors.brand100,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pill: {
    height: 24,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: radius.tag,
    backgroundColor: colors.warningBg,
  },
});
