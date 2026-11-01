import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { StackTabBar } from '@/components/features/GlassTabBar';
import { AppMap } from '@/components/features/MapView';
import { Text } from '@/components/ui/Text';
import { CAMPUS } from '@/data/mock/mapPins';
import { colors, layout } from '@/design-system/tokens';
import { CategoryHeader, CategoryRow } from '@/features/discovery/CategoryParts';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

// SB-032 · Quanh trường · Walking Distance: dishes sorted by distance under a 124pt real-map strip (card mode: tap once to
// enable gestures so the page keeps scrolling).
// ASSUMPTION (entry): "Xác nhận khu vực" on SB-018 opens it.
export default function Nearby() {
  const [offers, setOffers] = useState<OfferWithMerchant[]>([]);
  useEffect(() => {
    offerService
      .listOffers()
      .then((all) =>
        setOffers(
          all
            .filter((o) => o.category !== 'surprise')
            .sort((a, b) => (a.merchant.distanceM ?? 9e9) - (b.merchant.distanceM ?? 9e9)),
        ),
      );
  }, []);

  return (
    <View style={styles.container}>
      <CategoryHeader title="Quanh trường" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppMap
          mode="card"
          region={{ ...CAMPUS, latitudeDelta: 0.0075, longitudeDelta: 0.0075 }}
          style={styles.map}
        />
        <Text variant="largeTitle" style={{ fontSize: 24, lineHeight: 32 }}>
          Ở gần khu học xá
        </Text>
        <Text variant="rowSub" color="textSecondary" style={{ lineHeight: 18 }}>
          Chọn nơi thuận tiện để ghé nhận.
        </Text>
        {offers.map((o) => (
          <CategoryRow key={o.id} offer={o} />
        ))}
      </ScrollView>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  content: {
    gap: 16, // figma 294:4789: strip y12 (124), title y152, sub y200, rows (100) every 116
    paddingHorizontal: layout.screenGutter,
    paddingTop: 12,
    paddingBottom: layout.scrollBottomPadding,
  },
  // figma (screenshot): strip 353×124, r20, starts at y=127
  map: { height: 124, borderRadius: 20 },
});
