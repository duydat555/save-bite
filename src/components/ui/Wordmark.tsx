import { StyleSheet, View } from 'react-native';

import { SvgIcon } from './SvgIcon';
import { Text } from './Text';

type Props = { size: 'sm' | 'lg' };

/**
 * Brand lockup (Figma "Onboarding wordmark" / "Welcome wordmark").
 * sm = Forest mark 32 + 18pt brand900 text (onboarding); lg = Cream mark 64 + 36pt cream text (welcome).
 */
export function Wordmark({ size }: Props) {
  const large = size === 'lg';
  return (
    <View style={[styles.row, { gap: large ? 12 : 6 }]}>
      <SvgIcon name={large ? 'bag-mark-cream' : 'bag-mark-forest'} size={large ? 64 : 32} />
      <Text variant={large ? 'wordmarkLg' : 'wordmarkSm'} color={large ? 'canvas' : 'brand900'}>
        SaveBite
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
