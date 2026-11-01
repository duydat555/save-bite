import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { openOffer } from '@/utils/navigation';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { PressableScale } from '@/components/ui/PressableScale';
import { Tag } from '@/components/ui/Tag';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';

// SB-038 · Chi tiết cửa hàng · Merchant Profile. "Vị trí cửa hàng" → SB-039, "Cách nhận món" → SB-040.
export default function MerchantProfile() {
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
      <AppBar title="Cửa hàng" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {merchant.photo ? (
            <Image source={merchant.photo} contentFit="cover" style={StyleSheet.absoluteFill} />
          ) : null}
          <View style={styles.heroTag}>
            <Tag label="Ảnh minh họa" scheme="neutral" size="lg" />
          </View>
        </View>

        <View style={{ gap: 4 }}>
          <Text variant="authTitle" style={{ lineHeight: 28 }}>
            {merchant.name}
          </Text>
          <Text variant="authSub" color="textSecondary" style={{ lineHeight: 20 }}>
            {merchant.pickupPoint ?? ''}
          </Text>
          <Text variant="linkMedium13" color="success">
            Giờ nhận theo từng món
          </Text>
        </View>

        <View style={styles.pills}>
          <PressableScale
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/offer/merchant/[id]/directions',
                params: { id: merchant.id },
              })
            }
            style={[styles.pill, styles.pillOn]}
          >
            <Text variant="semi14" color="brand900">
              Vị trí cửa hàng
            </Text>
          </PressableScale>
          <PressableScale
            accessibilityRole="button"
            onPress={() => router.push('/offer/handover-rules')}
            style={[styles.pill, styles.pillOff]}
          >
            <Text variant="semi14">Cách nhận món</Text>
          </PressableScale>
        </View>

        <Text variant="bold15" style={{ fontSize: 17, lineHeight: 22 }}>
          Món tại cửa hàng này
        </Text>
        <View style={{ gap: 12 }}>
          {offers.map((o, i) => (
            <Animated.View key={o.id} entering={entering(i)}>
              <OfferListRow
                {...toRowProps(o)}
                title={o.listTitle ?? o.title}
                merchantLine={merchant.name}
                onPress={() => openOffer(o.id)}
              />
            </Animated.View>
          ))}
        </View>
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
    height: 170,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  heroTag: { position: 'absolute', left: 12, top: 134 },
  pills: { flexDirection: 'row', gap: 12, marginTop: 4 },
  pill: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  pillOn: { backgroundColor: colors.brand100 },
  pillOff: { borderWidth: 1, borderColor: colors.borderDefault, backgroundColor: colors.white },
});
