import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, layout } from '@/design-system/tokens';

import { Text } from './Text';

type Props = { title: string; right?: ReactNode; onPressTitle?: () => void };

/** Figma LargeTitleBar: 393×56, px20, 26pt Bold title (+ optional right action, e.g. "Chỉnh sửa" on SB-091). */
export function LargeTitleBar({ title, right, onPressTitle }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable accessible={false} onPress={onPressTitle} disabled={!onPressTitle}>
        <Text variant="largeTitle">{title}</Text>
      </Pressable>
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
