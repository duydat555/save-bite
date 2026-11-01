import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StackTabBar } from '@/components/features/GlassTabBar';
import { OfferListRow } from '@/components/features/OfferListRow';
import { SearchInputBar } from '@/features/discovery/SearchParts';
import { MapChip, MapDisclosure, MapPricePin, PeekSheetFrame } from '@/features/discovery/MapParts';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { duration } from '@/design-system/motion';
import { colors } from '@/design-system/tokens';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatPrice, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

// SB-016 · Map · Campus Explorer + SB-017 · peek sheet. The map is the static raster from Figma (no react-native-maps);
// pins are absolutely positioned Pressables in frame coordinates (393×852), so they stay put over the image.
// Pin positions/offers come from the Figma instances; merchant coordinates are demo (the design says "Ghim mẫu").
const PINS = [
  { offerId: 'offer-banh-sung-bo-bo-phap', left: 230, top: 225 },
  { offerId: 'offer-com-ga-ap-chao', left: 150, top: 350 },
  { offerId: 'offer-banh-mi-men-tu-nhien', left: 230, top: 420 },
] as const;

export default function MapTab() {
  const insets = useSafeAreaInsets();
  const [offers, setOffers] = useState<Record<string, OfferWithMerchant>>({});
  const [selected, setSelected] = useState<string>('offer-banh-mi-men-tu-nhien');

  useEffect(() => {
    offerService
      .listOffers()
      .then((list) => setOffers(Object.fromEntries(list.map((o) => [o.id, o]))));
  }, []);

  const current = offers[selected];

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/onboarding/campus-map.png')}
        contentFit="cover"
        style={styles.map}
      />

      {/* FloatingMapTopChrome */}
      <View style={[styles.search, { top: insets.top + 8 }]}>
        <SearchInputBar
          value="Khu học xá ĐH Đà Nẵng · Bán kính 1 km"
          onPressField={() => router.push('/discover/search')}
        />
      </View>
      <View style={[styles.chips, { top: insets.top + 64 }]}>
        <MapChip label="Bản đồ · 3" width={113} selected />
        <MapChip label="Danh sách" width={113} onPress={() => router.back()} />
        {/* Filter sheet (SB-023) is outside this batch — inert */}
        <MapChip label="Lọc" width={111} />
      </View>

      {PINS.map((p) => {
        const o = offers[p.offerId];
        if (!o) return null;
        return (
          <MapPricePin
            key={p.offerId}
            label={formatPrice(o.priceVnd)}
            selected={selected === p.offerId}
            style={{ left: p.left, top: p.top }}
            onPress={() => {
              Haptics.selectionAsync();
              setSelected(p.offerId);
            }}
          />
        );
      })}

      <View style={[styles.disclosure, { bottom: insets.bottom + 65 + 152 + 10 }]}>
        <MapDisclosure text="Vị trí và khoảng cách tham khảo" />
      </View>
      <View style={[styles.sheet, { bottom: insets.bottom + 65 }]}>
        <PeekSheetFrame>
          {current ? (
            <Animated.View
              key={current.id}
              entering={FadeIn.duration(duration.base)}
              exiting={FadeOut.duration(duration.fast)}
            >
              <OfferListRow
                {...toRowProps(current)}
                merchantLine={current.merchant.name}
                availabilityLabel={formatTimeRange(current.pickupStart, current.pickupEnd)}
                onPress={() => openOffer(current.id)}
              />
            </Animated.View>
          ) : null}
        </PeekSheetFrame>
      </View>
      <StackTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  map: { position: 'absolute', left: 0, top: 0, right: 0, height: 769 },
  search: { position: 'absolute', left: 20, right: 20 },
  chips: { position: 'absolute', left: 20, flexDirection: 'row', gap: 8 },
  disclosure: { position: 'absolute', left: 16 },
  sheet: { position: 'absolute', left: 16 },
});
