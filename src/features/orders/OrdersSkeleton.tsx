import { View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { radius } from '@/design-system/tokens';

/** Loading placeholder for SB-060 while reservations load: hero card (214) + two 64pt rows. */
export function OrdersSkeleton() {
  return (
    <View style={{ gap: 16 }}>
      <Skeleton height={214} radius={radius.md} />
      <View style={{ gap: 0, paddingTop: 4 }}>
        <Skeleton width={160} height={19} radius={6} style={{ marginBottom: 13 }} />
        <Skeleton height={56} radius={8} style={{ marginBottom: 8 }} />
        <Skeleton height={56} radius={8} />
      </View>
    </View>
  );
}
