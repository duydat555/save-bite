import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { colors, layout, radius } from '@/design-system/tokens';

/** Loading placeholder for the SB-015 offer grid (2 cards) + list rows; same measurements as the real items. */
export function DiscoverSkeleton() {
  return (
    <View style={{ gap: layout.sectionGap }}>
      <View style={styles.grid}>
        <Skeleton width={169} height={246} radius={radius.md} style={styles.bordered} />
        <Skeleton width={169} height={246} radius={radius.md} style={styles.bordered} />
      </View>
      <Skeleton height={92} radius={radius.listRow} style={styles.bordered} />
      <Skeleton height={92} radius={radius.listRow} style={styles.bordered} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 15 },
  bordered: { borderWidth: 1, borderColor: colors.borderDefault },
});
