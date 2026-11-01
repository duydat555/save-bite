import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/design-system/tokens';

import { Text } from './Text';

type Props = {
  label: string;
  scheme?: 'positive' | 'neutral';
  size?: 'sm' | 'lg';
};

/**
 * SDS Tag / semantic label. positive = brand100 fill + success text. neutral = translucent cream + muted text
 * (estimated from SB-034). sm = 22 high (OfferCard), lg = 32 high (hero photo labels). Warning / danger: TBD.
 */
export function Tag({ label, scheme = 'positive', size = 'sm' }: Props) {
  const large = size === 'lg';
  return (
    <View
      style={[
        styles.box,
        { height: large ? 32 : 22, paddingHorizontal: large ? 12 : 8 },
        scheme === 'positive' ? styles.positive : styles.neutral,
        large && styles.pill,
      ]}
    >
      <Text
        variant={large ? 'captionMeta' : 'meta'}
        color={scheme === 'positive' ? 'success' : 'textSecondary'}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { justifyContent: 'center', borderRadius: radius.tag },
  pill: { borderRadius: radius.pill },
  positive: { backgroundColor: colors.successBg },
  neutral: { backgroundColor: 'rgba(255,252,246,0.9)' },
});
