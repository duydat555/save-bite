import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, layout } from '@/design-system/tokens';

import { Text } from './Text';

type Props = { title: string; right?: ReactNode };

/** Figma LargeTitleBar: 393×56, px20, 26pt Bold title (+ optional right action, e.g. "Chỉnh sửa" on SB-091). */
export function LargeTitleBar({ title, right }: Props) {
  return (
    <View style={styles.bar}>
      <Text variant="largeTitle">{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenGutter,
    backgroundColor: colors.canvas,
  },
});
