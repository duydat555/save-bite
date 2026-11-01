import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout } from '@/design-system/tokens';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { SearchInputBar } from '@/features/discovery/SearchParts';
import { useStaggerEntering } from '@/hooks/useEntering';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatMerchantLine, formatPrice, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';

// SB-021 · Kết quả tìm kiếm and SB-022 · No results. Params: q (text), or max (price cap) / window (pickup start).
// ASSUMPTION: the quick-chip filters ("Tối đa 30.000đ", "Nhận 17:00–18:00") reuse this layout.
export default function Results() {
  const insets = useSafeAreaInsets();
  const {
    q,
    max,
    window: win,
  } = useLocalSearchParams<{ q?: string; max?: string; window?: string }>();
  const [results, setResults] = useState<OfferWithMerchant[] | null>(null);
  const [others, setOthers] = useState<OfferWithMerchant[]>([]);
  const entering = useStaggerEntering();

  useEffect(() => {
    let live = true;
    (async () => {
      const all = (await offerService.listOffers()).filter((o) => o.category !== 'surprise');
      let found: OfferWithMerchant[];
      if (q) found = (await offerService.searchOffers(q)).filter((o) => o.category !== 'surprise');
      else if (max) found = all.filter((o) => o.priceVnd <= Number(max));
      else if (win) found = all.filter((o) => o.pickupStart === win);
      else found = all;
      if (!live) return;
      setResults(found);
      setOthers(all.filter((o) => !found.some((f) => f.id === o.id)));
    })();
    return () => {
      live = false;
    };
  }, [q, max, win]);

  const label = q ? `“${q}”` : max ? 'ngân sách' : 'khung giờ';

  if (results === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
        <ActivityIndicator style={{ marginTop: 80 }} color={colors.brand900} />
      </View>
    );
  }

  /* ---------- SB-022 · no results ---------- */
  if (results.length === 0) {
    const fallback = (others.length ? others : []).slice(0, 2);
    return (
      <View style={styles.container}>
        <View style={{ height: insets.top }} />
        <AppBar title="Kết quả tìm kiếm" />
        <ScrollView
          contentContainerStyle={[styles.emptyContent, { paddingBottom: insets.bottom + 24 }]}
        >
          <View style={styles.mam}>
            <SvgIcon name="mam-search" size={120} />
          </View>
          <Text variant="title20" style={styles.center}>{`Chưa có món ${label}`}</Text>
          <Text variant="body" color="textSecondary" style={[styles.center, { lineHeight: 18 }]}>
            Thử đổi từ khóa hoặc xem các món đang có quanh khu học xá.
          </Text>
          <Button label="Xem tất cả món" onPress={() => router.dismissAll()} />
          <Button
            label="Đổi từ khóa"
            variant="neutral"
            style={{ height: 52 }}
            onPress={() => router.back()}
          />
          <Text variant="bold15" style={{ marginTop: 4 }}>
            Có thể bạn quan tâm gần Khu học xá
          </Text>
          {fallback.map((o, i) => (
            <Animated.View key={o.id} entering={entering(i)}>
              <OfferListRow
                {...toRowProps(o)}
                merchantLine={formatMerchantLine(o.merchant, 'card')}
                onPress={() => openOffer(o.id)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    );
  }

  /* ---------- SB-021 · results ---------- */
  const first = results[0];
  const heading = q ? `${results.length} món khớp “${q}”` : `${results.length} món phù hợp`;
  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.pad}>
        <SearchInputBar
          value={q ?? (max ? 'Tối đa 30.000đ' : 'Nhận 17:00–18:00')}
          onPressField={() => router.back()}
        />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="title20">{heading}</Text>
        <Text variant="captionMeta" color="textSecondary" style={{ marginTop: 16 }}>
          {`Nhận sau giờ học · ${formatTimeRange(first.pickupStart, first.pickupEnd)}`}
        </Text>
        <View style={{ gap: 8, marginTop: 16 }}>
          {results.map((o, i) => (
            <Animated.View key={o.id} entering={entering(i)}>
              <OfferListRow {...toRowProps(o)} onPress={() => openOffer(o.id)} />
            </Animated.View>
          ))}
        </View>

        {others.length > 0 ? (
          <>
            <Text variant="title20" style={{ marginTop: 16 }}>
              Khám phá món khác
            </Text>
            <View style={styles.alts}>
              {others.slice(0, 2).map((o) => (
                <AltCard key={o.id} offer={o} />
              ))}
            </View>
            {q ? (
              <Text variant="captionMeta" color="textSecondary" style={{ marginTop: 16 }}>
                {`Các món gợi ý thêm không thuộc kết quả “${q}”.`}
              </Text>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

/* "Other categories · photo-led" card: 168 wide, photo 112 (r16), title 2 lines, price + pickup lines. */
function AltCard({ offer }: { offer: OfferWithMerchant }) {
  return (
    <PressableScale
      accessibilityRole="button"
      onPress={() => openOffer(offer.id)}
      style={styles.alt}
    >
      <Image source={offer.image} contentFit="cover" style={styles.altPhoto} />
      <Text variant="alt17" numberOfLines={2} style={{ marginTop: 8 }}>
        {offer.title}
      </Text>
      <Text variant="alt14" color="textSecondary" style={{ marginTop: 8 }}>
        {`${formatPrice(offer.priceVnd)}\nNhận ${formatTimeRange(offer.pickupStart, offer.pickupEnd)}`}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  pad: { paddingHorizontal: layout.screenGutter },
  content: { paddingHorizontal: layout.screenGutter, paddingTop: 12 },
  emptyContent: { gap: 16, paddingHorizontal: layout.screenGutter, paddingTop: 20 },
  mam: { alignItems: 'center' },
  center: { textAlign: 'center' },
  alts: { flexDirection: 'row', gap: 17, marginTop: 16 },
  alt: { width: 168 },
  altPhoto: { width: 168, height: 112, borderRadius: 16 },
});
