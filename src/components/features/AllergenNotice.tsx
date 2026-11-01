import { StyleSheet, View } from 'react-native';

import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/design-system/tokens';
import { PressableScale } from '@/components/ui/PressableScale';

type Props = { title: string; body: string; onPress?: () => void };

/** Figma AllergenNotice (353×82): warning-tinted card, r14, 1px #F1DEC6. */
export function AllergenNotice({ title, body, onPress }: Props) {
  return (
    <PressableScale accessibilityRole="button" onPress={onPress} style={styles.card}>
      <SvgIcon name="warn" size={18} />
      <View style={styles.text}>
        <Text variant="noticeTitle" color="warning">
          {title}
        </Text>
        <Text variant="noticeBody" color="textSecondary">
          {body}
        </Text>
      </View>
      <SvgIcon name="caret-warn-16" size={16} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  text: { flex: 1, gap: 3 },
});
