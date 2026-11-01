import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { StackTabBar } from '@/components/features/GlassTabBar';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import { CategoryHeader, CategoryRow } from '@/features/discovery/CategoryParts';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

// SB-031 · Nhận sớm · Urgent Rescues: every dish ordered by pickup start. ASSUMPTION (entry): the "Chọn cho chiều nay"
// title on Khám phá opens it (no link drawn in Figma).
export default function Urgent() {
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* figma 104:2475: header block 60 high at y125 (title 28 + sub 16 at +30), rows at y200 */}
        <View style={{ height: 60, marginBottom: 3 }}>
          <Text variant="largeTitle" style={{ fontSize: 24, lineHeight: 28 }}>
            Khung nhận gần nhất
          </Text>
          <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 16, marginTop: 2 }}>
            Chọn món theo giờ bạn có thể ghé nhận
          </Text>
        </View>
        {offers.map((o) => (
          <CategoryRow key={o.id} offer={o} height={92} />
        ))}
      </ScrollView>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 12,
    paddingHorizontal: layout.screenGutter,
    paddingTop: 10,
    paddingBottom: layout.scrollBottomPadding,
  },
});
