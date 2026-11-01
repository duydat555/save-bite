import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatMerchantLine } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

// SB-041 · Offer khác của tiệm · More Offers.
export default function MerchantOffers() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [offers, setOffers] = useState<OfferWithMerchant[] | null>(null);
  const entering = useStaggerEntering();

  useEffect(() => {
    offerService.listOffers().then((all) => setOffers(all.filter((o) => o.merchantId === id)));
  }, [id]);

  const merchant = offers?.[0]?.merchant;
  if (!offers || !merchant) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand900} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Ưu đãi của tiệm" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {merchant.photo ? (
            <Image source={merchant.photo} contentFit="cover" style={StyleSheet.absoluteFill} />
          ) : null}
        </View>
        <Text variant="largeTitle" style={{ fontSize: 28, lineHeight: 34 }}>
          {merchant.name}
        </Text>
        <Text variant="captionMeta" color="textSecondary" style={{ marginTop: -2 }}>
          {`${offers.length} lựa chọn · Nhận và trả tại tiệm`}
        </Text>
        <View style={{ gap: 16 }}>
          {offers.map((o, i) => (
            <Animated.View key={o.id} entering={entering(i)}>
              <OfferListRow
                {...toRowProps(o)}
                title={o.listTitle ?? o.title}
                merchantLine={formatMerchantLine(merchant, 'card')}
                onPress={() => openOffer(o.id)}
              />
            </Animated.View>
          ))}
        </View>
        <Text variant="captionMeta" color="textSecondary">
          Chọn món và xem khung giờ nhận tại tiệm.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
  content: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  hero: {
    height: 144,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
});
