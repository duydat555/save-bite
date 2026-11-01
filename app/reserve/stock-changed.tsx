import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferListRow } from '@/components/features/OfferListRow';
import { AppBar } from '@/components/ui/AppBar';
import { Button } from '@/components/ui/Button';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Text } from '@/components/ui/Text';
import { colors, layout, radius } from '@/design-system/tokens';
import { toRowProps } from '@/features/discovery/offerPresenter';
import { useOffer } from '@/features/offer/useOffer';
import { offerService } from '@/services/offerService';
import type { OfferWithMerchant } from '@/types';
import { formatMerchantLine, formatPrice, formatTimeRange } from '@/utils/format';
import { openOffer } from '@/utils/navigation';
import { useEffect, useState } from 'react';

// SB-058 · Stock Changed · Recovery. Someone reserved first: offer the remaining 1 portion or another item.
export default function StockChanged() {
  const insets = useSafeAreaInsets();
  const { offerId, qty } = useLocalSearchParams<{ offerId: string; qty?: string }>();
  const n = Math.max(2, Number(qty) || 2); // the screen exists because the wanted amount is no longer available
  const offer = useOffer(offerId);
  const [others, setOthers] = useState<OfferWithMerchant[]>([]);

  useEffect(() => {
    offerService
      .listOffers()
      .then((all) =>
        setOthers(
          all.filter(
            (o) =>
              o.id !== offerId &&
              o.merchantId === all.find((x) => x.id === offerId)?.merchantId &&
              o.category !== 'surprise',
          ),
        ),
      );
  }, [offerId]);

  if (!offer) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand900} />
      </View>
    );
  }
  const range = formatTimeRange(offer.pickupStart, offer.pickupEnd);
  const alt = others[0];

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />
      <AppBar title="Giữ chỗ" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge}>
          <SvgIcon name="warn" size={40} />
        </View>
        <Text variant="largeTitle" style={styles.center2}>
          Số lượng vừa thay đổi
        </Text>
        <Text
          variant="body"
          color="textSecondary"
          style={[styles.center2, { fontSize: 14, lineHeight: 20 }]}
        >
          {`Vừa có người giữ chỗ trước bạn. Hiện chỉ còn 1 phần cho khung ${range}.`}
        </Text>

        <View style={styles.compare}>
          <View style={styles.cmpRow}>
            <Text variant="linkMedium14" color="textSecondary">
              Bạn đã chọn
            </Text>
            <Text
              variant="semi14"
              color="price"
            >{`${n} phần · ${formatPrice(offer.priceVnd * n)}`}</Text>
          </View>
          <View style={styles.rule} />
          <View style={styles.cmpRow}>
            <Text variant="linkMedium14" color="textSecondary">
              Còn lại
            </Text>
            <Text
              variant="semi14"
              color="success"
            >{`1 phần · ${formatPrice(offer.priceVnd)}`}</Text>
          </View>
        </View>

        <Button
          label={`Giảm xuống 1 phần · ${formatPrice(offer.priceVnd)}`}
          onPress={() =>
            router.replace({
              pathname: '/reserve/summary',
              params: { offerId: offer.id, qty: '1' },
            })
          }
        />

        {alt ? (
          <>
            <Text variant="bold15" style={{ marginTop: 6 }}>
              {`Hoặc chọn món khác của ${offer.merchant.name}`}
            </Text>
            <OfferListRow
              {...toRowProps(alt)}
              merchantLine={formatMerchantLine(alt.merchant, 'card')}
              onPress={() => openOffer(alt.id)}
            />
          </>
        ) : null}
        <Button
          label="Quay lại chi tiết món"
          variant="neutral"
          style={{ height: 52, marginTop: 8 }}
          onPress={() => router.dismissTo({ pathname: '/offer/[id]', params: { id: offer.id } })}
        />
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
  content: { gap: 14, paddingHorizontal: layout.screenGutter, paddingTop: 4 },
  center2: { textAlign: 'center', fontSize: 22, lineHeight: 28 },
  badge: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    backgroundColor: colors.warningBg,
  },
  compare: { padding: 16, borderRadius: radius.tile, backgroundColor: colors.surfaceSubtle },
  cmpRow: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rule: { height: 1, backgroundColor: colors.borderDefault },
});
