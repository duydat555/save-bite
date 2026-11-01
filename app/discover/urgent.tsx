import Animated from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTabBarScroll } from '@/components/features/tabBarState';
import { StackTabBar } from '@/components/features/GlassTabBar';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import { CategoryHeader, CategoryRow } from '@/features/discovery/CategoryParts';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

// SB-031 · Nhận sớm · Urgent Rescues: every dish ordered by pickup start. ASSUMPTION (entry): the "Chọn cho chiều nay"
// title on Khám phá opens it (no link drawn in Figma).
export default function Urgent() {
  const onTabBarScroll = useTabBarScroll();
  const [offers, setOffers] = useState<OfferWithMerchant[]>([]);
  useEffect(() => {
    offerService
      .listOffers()
      .then((all) =>
        setOffers(
          all
            .filter((o) => o.category !== 'surprise')
            .sort((a, b) => a.pickupStart.localeCompare(b.pickupStart)),
        ),
      );
  }, []);

  return (
    <View style={styles.container}>
      <CategoryHeader title="Nhận sớm" />
      <Animated.ScrollView
        onScroll={onTabBarScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="largeTitle" style={{ fontSize: 24, lineHeight: 30 }}>
          Khung nhận gần nhất
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ marginTop: -8 }}>
          Chọn món theo giờ bạn có thể ghé nhận.
        </Text>
        {offers.map((o) => (
          <CategoryRow key={o.id} offer={o} />
        ))}
      </Animated.ScrollView>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 12,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: layout.scrollBottomPadding,
  },
});
